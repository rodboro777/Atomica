# Inspired by https://github.com/susanli2016/NLP-with-Python/blob/master/Text_Classification_With_BERT.ipynb
from transformers import BertForSequenceClassification
from torch.utils.data import DataLoader, RandomSampler, SequentialSampler
from transformers import AdamW, get_linear_schedule_with_warmup
import random
import numpy as np
import torch
from transformers import BertTokenizer
from torch.utils.data import TensorDataset
from torch.nn import functional as F
from tqdm import tqdm
from utils import import_data

class TGFilterModel:
    def __init__(self, model_name, batch_size=None, epochs=None):
        df = import_data("data.txt")
        # Prepare data for training
        self.tokenizer = BertTokenizer.from_pretrained(model_name, do_lower_case=True)
        self.batch_size = batch_size if batch_size is not None else 5
        self.epochs = epochs if epochs is not None else 10
        self.label_dict, self.dataloader_train, self.dataloader_validation = self.__prepare_data(df)

        self.model = BertForSequenceClassification.from_pretrained(model_name, num_labels=len(self.label_dict), output_attentions=False, output_hidden_states=False)
        self.optimizer = AdamW(self.model.parameters(),
                  lr=1e-5, 
                  eps=1e-8)
        self.scheduler = get_linear_schedule_with_warmup(self.optimizer, 
                                            num_warmup_steps=0,
                                            num_training_steps=len(self.dataloader_train)*self.epochs)

        self.device = torch.device('mps')
        self.model.to(self.device)

    def train(self):
        seed_val = 17
        random.seed(seed_val)
        np.random.seed(seed_val)
        torch.manual_seed(seed_val)
        torch.cuda.manual_seed_all(seed_val)

        for epoch in tqdm(range(1, self.epochs + 1)):
            self.model.train()
            loss_train_total = 0

            progress_bar = tqdm(self.dataloader_train, desc='Epoch {:1d}'.format(epoch), leave=False, disable=False)
            for batch in progress_bar:
                self.model.zero_grad()
                batch = tuple(b.to(self.device) for b in batch)
                inputs = {
                    'input_ids':      batch[0],
                    'attention_mask': batch[1],
                    'labels':         batch[2],
                }
                outputs = self.model(**inputs)

                loss = outputs[0]
                loss_train_total += loss.item()
                loss.backward()

                torch.nn.utils.clip_grad_norm_(self.model.parameters(), 1.0)

                self.optimizer.step()
                self.scheduler.step()

                progress_bar.set_postfix({'training_loss': '{:.3f}'.format(loss.item()/len(batch))})

            torch.save(self.model.state_dict(), f'saved_models/finetuned_BERT_epoch_{epoch}.model')
            tqdm.write(f'\nEpoch {epoch}')
    
            loss_train_avg = loss_train_total/len(self.dataloader_train)            
            tqdm.write(f'Training loss: {loss_train_avg}')
            
            val_loss = self.validation()
            tqdm.write(f'Validation loss: {val_loss}')

    def validation(self):
        self.model.eval()
        loss_val_total = 0

        for batch in self.dataloader_validation:
            batch = tuple(b.to(self.device) for b in batch)
            inputs = {
                "input_ids": batch[0],
                "attention_mask": batch[1],
                "labels": batch[2]
            }

            with torch.no_grad():
                outputs = self.model(**inputs)
            
            loss = outputs[0]
            loss_val_total += loss.item()
        
        loss_val_avg = loss_val_total/len(self.dataloader_validation) 
                
        return loss_val_avg

    def load_model(self, name):
        self.model.load_state_dict(torch.load(name, map_location=torch.device("cpu")))

    def infer(self, s):
        label_dict_inverse = {v: k for k, v in self.label_dict.items()}
        encoded_data = self.tokenizer.encode_plus(
                s, 
                add_special_tokens=True, 
                return_attention_mask=True, 
                padding='max_length',
                max_length=512, 
                return_tensors='pt',
                truncation=True
        )
            
        self.model.eval()
        with torch.no_grad():
            output = self.model(
                    input_ids=encoded_data.input_ids.to(self.device), 
                    attention_mask=encoded_data.attention_mask.to(self.device),
            )
            
        logits = output.logits.detach().cpu()
        logits = F.softmax(logits, dim=-1)
        res = dict()
        for i, prob in enumerate(logits.numpy().flatten()):
            res[label_dict_inverse[i]] = str(prob)

        return res

    def __prepare_data(self, df):
        labels_unique = df.status.unique()
        label_dict = dict()
        for i, label in enumerate(labels_unique):
            label_dict[label] = i

        df["label"] = df.status.replace(label_dict)

        # Split data to train and validation. Using a very small percentage of the data for validation since it's limited.
        # Stratify is used to make sure that the distribution percentage of each classes in train and validation datasets is the same.
        from sklearn.model_selection import train_test_split
        x_train, x_val, _, _ = train_test_split(df.index.values, df.label.values, test_size=0.1, random_state=42, stratify=df.label.values)

        df['data_type'] = ['not_set'] * df.shape[0]
        df.loc[x_train, 'data_type'] = 'train'
        df.loc[x_val, 'data_type'] = 'val'

        encoded_data_train = self.tokenizer.batch_encode_plus(
            df[df.data_type=='train'].text.values, 
            add_special_tokens=True, 
            return_attention_mask=True, 
            pad_to_max_length=True, 
            max_length=512, 
            return_tensors='pt',
            truncation=True
        )

        encoded_data_val = self.tokenizer.batch_encode_plus(
            df[df.data_type=='val'].text.values, 
            add_special_tokens=True, 
            return_attention_mask=True, 
            pad_to_max_length=True, 
            max_length=512, 
            return_tensors='pt',
            truncation=True
        )

        input_ids_train = encoded_data_train['input_ids']
        attention_masks_train = encoded_data_train['attention_mask']
        labels_train = torch.tensor(df[df.data_type=='train'].label.values)

        input_ids_val = encoded_data_val['input_ids']
        attention_masks_val = encoded_data_val['attention_mask']
        labels_val = torch.tensor(df[df.data_type=='val'].label.values)

        dataset_train = TensorDataset(input_ids_train, attention_masks_train, labels_train)
        dataset_val = TensorDataset(input_ids_val, attention_masks_val, labels_val)

        dataloader_train = DataLoader(dataset_train, 
                              sampler=RandomSampler(dataset_train), 
                              batch_size=self.batch_size)

        dataloader_validation = DataLoader(dataset_val, 
                                   sampler=SequentialSampler(dataset_val), 
                                   batch_size=self.batch_size)

        return label_dict, dataloader_train, dataloader_validation
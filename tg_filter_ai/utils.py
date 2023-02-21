import pandas as pd

# Import data from given filename. The data was collected manually from ChatGPT and TripAdvisor since unfortunately no APIs that can be used to provide the data.
def import_data(filename):
    df_dict = {
        "text": [],
        "status": []
    }

    with open(filename) as f:
        for line in f.readlines():
            splitted = line.strip().split(",")
            df_dict["status"].append(splitted[-1])
            df_dict["text"].append(",".join(splitted[:len(splitted) - 1]))

    df = pd.DataFrame(df_dict)
    return df
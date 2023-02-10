import csv
import pandas as pd
# Read the csv into a Pandas DataFrame
exoplanets = pd.read_csv('data/exoplanets.csv')
# Examine the shape of the data
exoplanets.shape
# Explore null cells
exoplanets.isnull()
# View total of null values by column
exoplanets.isnull().sum()
# View the number of null values in the 'TAXI_OUT' column
# exoplanets['TAXI_OUT'].isnull().sum()
# Remove all null values
exoplanets = exoplanets.dropna()
# Store the dataframe as a new CSV
exoplanets.to_csv('data/new.csv', index=False)

""" my_file_name = "data/exoplanets-label-blanks.csv"
cleaned_file = "data/test.csv"
remove_words = ['BLANK']

with open(my_file_name, 'r', newline='') as infile, \
        open(cleaned_file, 'w', newline='') as outfile:
    writer = csv.writer(outfile)
    for line in csv.reader(infile, delimiter='|'):
        if not any(remove_word in element for element in line for remove_word in remove_words):
            writer.writerow(line) """

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

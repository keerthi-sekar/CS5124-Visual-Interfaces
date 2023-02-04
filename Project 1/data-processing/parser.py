import csv

my_file_name = "data/exoplanets-label-blanks.csv"
cleaned_file = "data/clean-exoplanets.csv"
remove_words = ['BLANK']

with open(my_file_name, 'r', newline='') as infile, \
        open(cleaned_file, 'w', newline='') as outfile:
    writer = csv.writer(outfile)
    for line in csv.reader(infile, delimiter='|'):
        if not any(remove_word in element for element in line for remove_word in remove_words):
            writer.writerow(line)

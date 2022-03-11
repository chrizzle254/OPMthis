import csv

def create_csv_file(timestamp):

    # Define CSV file
    with open('files/events-' + timestamp + '.csv', 'w', newline='') as csv_dump:
        writer = csv.writer(csv_dump,delimiter=';')
        writer.writerow(["case:concept:name","concept:name","time:timestamp"]) # We can add more columns here to add more information
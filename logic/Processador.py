import csv
import sys
import datetime
from tkinter import messagebox


def is_weekend(row):
    return 'sáb' in row[0] or 'dom' in row[0]

def is_holiday(row):
    return messagebox.askyesno(message=f"Nenhum ponto registrado no dia {row[0].split(' ')[1]}.\nEste dia foi um feriado?", icon='question', title='Holiday?')

def validate_punch_count(row, count, root):
    if count < 5:
        if count == 1:
            if is_holiday(row):
                return True
            else:
                messagebox.showinfo(message="Necessário ajuste de ponto para continuar!")
                root.destroy()
                sys.exit()
        messagebox.showinfo(message=f"Apenas {count - 1} pontos registrados no dia {row[0].split(" ")[1]}.\nNecessário ajuste de ponto para continuar!")
        root.destroy()
        sys.exit()
    elif count > 5:
        messagebox.showinfo(message=f"Quantidade de pontos diários ultrapassada!\n{count - 1} pontos registrados no dia {row[0].split(" ")[1]}.\nNecessário ajuste de ponto para continuar!")
        root.destroy()
        sys.exit()

def calculate_hours(row):
    start_time = datetime.datetime.strptime(row[1], "%H:%M")
    start_of_interval = datetime.datetime.strptime(row[2], "%H:%M")
    final_of_interval = datetime.datetime.strptime(row[3], "%H:%M")
    final_time = datetime.datetime.strptime(row[4], "%H:%M")
    return (final_time - start_time) - (final_of_interval - start_of_interval)

def process_csv(filename, root):
    total_seconds = 0
    count_row = 0

    with open(filename, mode='r', newline='', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        next(reader) # Pula o cabeçalho

        for row in reader:
            row = [item.split('\n')[0] for item in row]
            count = sum(1 for item in row if item) # Conta itens não vazios

            if is_weekend(row):
                continue

            validate_punch_count(row, count, root)

            if all(row[i] for i in range(1,5)):
                daily_hours = calculate_hours(row)
                total_seconds += daily_hours.seconds
                count_row += 1

    return display_results(total_seconds, count_row)

def display_results(total_seconds, count_row):
    daily_workload = datetime.timedelta(hours=8, minutes=48)
    workload = daily_workload.seconds * count_row

    hours_required = workload // 3600
    minutes_required = (workload % 3600) // 60
    hr = str(hours_required) + ":" + str(minutes_required)

    hours_worked = total_seconds // 3600
    minutes_worked = (total_seconds % 3600) // 60
    hw = str(hours_worked) + ":" + str(minutes_worked)

    extras_or_pending = total_seconds - workload
    abs_extras_or_pending = abs(extras_or_pending)
    hours = abs_extras_or_pending // 3600
    minutes = (abs_extras_or_pending % 3600) // 60

    sign = "-" if extras_or_pending < 0 else ""

    h = str(sign) + str(hours) + ":" + str(minutes)

    return hr, hw, h
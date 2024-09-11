import os
import csv
import sys

def print_directory_contents(path):
    print(f"Contents of '{path}':")
    try:
        for item in os.listdir(path):
            print(f" - {item}")
    except FileNotFoundError:
        print(f"  Error: Directory '{path}' not found.")

def get_file_structure(start_path, output_file):
    abs_start_path = os.path.abspath(start_path)
    
    print(f"Attempting to access: {abs_start_path}")
    
    if not os.path.exists(abs_start_path):
        print(f"Error: The path '{abs_start_path}' does not exist.")
        return

    structure = []
    max_depth = 0

    for root, dirs, files in os.walk(abs_start_path):
        level = root.replace(abs_start_path, '').count(os.sep)
        max_depth = max(max_depth, level)
        
        rel_path = os.path.relpath(root, abs_start_path)
        if rel_path == '.':
            row = ['<components>'] + [''] * max_depth
        else:
            path_parts = rel_path.split(os.sep)
            row = [''] * level + [f'<{path_parts[-1]}>'] + [''] * (max_depth - level)
        structure.append(row)
        
        for file in files:
            file_row = [''] * (level + 1) + [file] + [''] * (max_depth - level - 1)
            structure.append(file_row)

    with open(output_file, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        headers = [f'Level {i}' for i in range(max_depth + 1)]
        writer.writerow(headers)
        writer.writerows(structure)

def find_components_dir(start_dir):
    for root, dirs, files in os.walk(start_dir):
        if 'src' in dirs:
            src_dir = os.path.join(root, 'src')
            if 'components' in os.listdir(src_dir):
                return os.path.join(src_dir, 'components')
    return None

# Usage
current_dir = os.path.dirname(os.path.abspath(__file__))
print(f"Script location: {current_dir}")

# Try to find the components directory
components_dir = find_components_dir(current_dir)

if components_dir:
    print(f"Found components directory: {components_dir}")
    start_path = components_dir
else:
    print("Error: Could not find 'src/components' directory.")
    print("Directory structure:")
    for root, dirs, files in os.walk(current_dir):
        level = root.replace(current_dir, '').count(os.sep)
        indent = ' ' * 4 * level
        print(f"{indent}{os.path.basename(root)}/")
        sub_indent = ' ' * 4 * (level + 1)
        for file in files:
            print(f"{sub_indent}{file}")
    sys.exit(1)

output_file = os.path.join(current_dir, 'components_structure.csv')

get_file_structure(start_path, output_file)
print(f"File structure has been exported to {output_file}")
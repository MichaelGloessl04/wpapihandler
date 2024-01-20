import os


test_files = []
out_content = ''

for file in os.listdir('__tests__'):
    if file.endswith('.test.ts'):
        with open(os.path.join('__tests__', file), 'r') as f:
            test_files.append((file, f.read()))

for file_counter, (class_name, file) in enumerate(test_files):
    skiped = 0
    out_content += f'--- {file_counter + 1}. {class_name} ---\n'
    file = file.replace('\n', '').replace('\t', '').replace('  ', '')
    test_desc = file.split('describe(')[1:]
    for desc_counter, desc in enumerate(test_desc[:]):
        test_it = desc.split('it(')[1:]
        if len(test_it) == 0:
            skiped += 1
            continue
        desc_name = desc.split(',')[0].replace("'", '')
        out_content += f'{file_counter + 1}.{desc_counter + 1 - skiped}: {desc_name}\n'
        for it_counter, it_name in enumerate(test_it):
            it_name = it_name.split(',')[0].replace("'", '')
            out_content += f'{file_counter + 1}.{desc_counter + 1 - skiped}.{it_counter + 1}: {desc_name} {it_name}\n'
        out_content += '\n'
    out_content += '\n'

with open('__tests__/docs/test_docs.txt', 'w') as f:
    f.write(out_content.strip())

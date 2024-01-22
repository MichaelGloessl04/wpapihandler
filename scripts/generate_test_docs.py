import os


def clean_string(string):
    return string.replace('\n', '').replace('\t', '').replace('  ', '')


test_files = []

for file in os.listdir('__tests__'):
    if file.endswith('.test.ts'):
        with open(os.path.join('__tests__', file), 'r') as f:
            test_files.append((file, f.read()))


out_content = '# Test Docs\n\n'
out_content += '## Table of Contents:\n'

for file_counter, (class_name, file) in enumerate(test_files):
    skipped = 0
    out_content += f'- {file_counter + 1}. {class_name}\n'
    file = clean_string(file)
    test_desc = file.split('describe(')[1:]
    for desc_counter, desc in enumerate(test_desc[:]):
        test_it = desc.split('it(')[1:]
        if len(test_it) == 0:
            skipped += 1
            continue
        desc_name = desc.split(',')[0].replace("'", '')
        out_content += f'  - {file_counter + 1}.{desc_counter + 1 - skipped}: {desc_name}\n'
        for it_counter, it_name in enumerate(test_it):
            it_name = it_name.split(',')[0].replace("'", '')
            out_content += f'    - {file_counter + 1}.{desc_counter + 1 - skipped}.{it_counter + 1}: {desc_name} {it_name}\n'


out_content += '\n\n'
out_content += '## Test Docs:\n'

for file_counter, (class_name, file) in enumerate(test_files):
    skipped = 0
    out_content += f'### {file_counter + 1}. {class_name}\n'
    file = clean_string(file)
    test_desc = file.split('describe(')[1:]
    for desc_counter, desc in enumerate(test_desc[:]):
        test_it = desc.split('it(')[1:]
        if len(test_it) == 0:
            skipped += 1
            continue
        desc_name = desc.split(',')[0].replace("'", '')
        out_content += f'#### {file_counter + 1}.{desc_counter + 1 - skipped}: {desc_name}\n'
        for it_counter, it_name in enumerate(test_it):
            it_name = it_name.split(',')[0].replace("'", '')
            out_content += f'##### {file_counter + 1}.{desc_counter + 1 - skipped}.{it_counter + 1}: {desc_name} {it_name}\n'
            comment = desc.split('/*')[1].split('*/')[0]
            test_description = comment.split('@description')[1:][0].split('@expect')[0]
            test_expect = comment.split('@expect')[1:]
            test_fail = comment.split('@fails')[1:]
            out_content += f'{clean_string(test_description).strip()[:-1].strip()}\n\n'
            out_content += '_expect:_\n'
            for expect in test_expect:
                if expect.count('@') > 0:
                    out_content += f'- {clean_string(expect.split("@")[0]).strip()[:-1].strip()}\n'
                else:
                    out_content += f'- {clean_string(expect).strip()[:-1].strip()}\n'
            out_content += '\n'
            out_content += '_fails:_\n'
            for fail in test_fail:
                out_content += f'- {clean_string(fail).strip()}\n'
            out_content += '\n'
        out_content += '\n'
    out_content += '\n'

with open('__tests__/docs/test_docs.md', 'w') as f:
    f.write(out_content.strip())

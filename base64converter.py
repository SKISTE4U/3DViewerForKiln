import base64

file_text = open('zvd.glb', 'rb')
file_read = file_text.read()
file_encode = base64.b64encode(file_read)

file_encode = str(file_encode).replace("\n","")
file_encode = file_encode.replace("\n","")
# print(file_encode)
file_encode = file_encode.replace('b\'','')
file_encode = file_encode.replace('\'','')


with open('RealLastTest/js/zvd.js','w',encoding='utf-8') as file:
    file.write('const ZVD_obj = "'+str(file_encode)+'"')

file1 = open("/home/pavan/city.txt","r")
#file2 = open("/home/pavan/city_code.txt","r")
file3 = open("/home/pavan/done.txt","w")
temp=''
str1='hello'
while str1!='':
    str1 = file1.readline()
    if(str1==''):
        break
    str1=str1.rstrip('\n')
    #str2 = file2.readline()
    #str2 = str2.rstrip('\n')
    #tem="INSERT INTO ahmedabad(sublocality,Code) VALUES(\'"+str1+"\',"+str2+");"
    tem="INSERT INTO kolkata(sublocality) VALUES('"+str1+"');";
    temp=temp+tem 
file3.write(temp) 

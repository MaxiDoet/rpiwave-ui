#Some system management calls

def shutdown():
    os.system("shutdown -h now")

def dim_down():
    os.system("systemctl start brightness-down")

def dim_normal():
    os.system("systemctl start brightness-normal")


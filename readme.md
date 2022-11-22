# Jenkin installation on AWS instance Ubuntu

>steps:
>>* Create Ubuntu instance.  
>>* Remember to put Security groups. ***ssh, http, https, custom->8080***  
>>* Run all this commands **I found this for latest update**


## 2022 update
[commands found from here](https://community.jenkins.io/t/ubuntu-20-04-initial-jenkins-startup-failure/1419/2)
```bash
$ sudo apt-get install openjdk-11-jdk-headless
```
```bash
$ curl -fsSL https://pkg.jenkins.io/debian/jenkins.io.key | sudo tee \
    /usr/share/keyrings/jenkins-keyring.asc > /dev/null
```
```bash
$ echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
    https://pkg.jenkins.io/debian binary/ | sudo tee \
    /etc/apt/sources.list.d/jenkins.list > /dev/null
```
```bash
$ sudo apt-get update
```
```bash
$ sudo apt-get install jenkins
```

[If not working try to enable tcp port](https://www.digitalocean.com/community/tutorials/how-to-install-jenkins-on-ubuntu-20-04)

# Jenkin installation on AWS instance Ubuntu
[http://35.77.106.242:8080/](http://35.77.106.242:8080/)
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


# VPC-endpoint-for-S3
 If the aws s3 ls & aws s3 mb command is not working than specify your region in the command from which you are making the request i.e aws s3 ls --region US-East-2(Specify your region in which you have created the private subnet instance, In my case it was US-East-2), aws s3 mb s3://(bucket name) --region (Region name) than press enter and your bucket will get created


### uncover Topics  
- 1. AWS Global Infrastructure
- 2. Identity and Access Management
- 3. AWS Compute
- 4. AWS Storage
- 5. AWS Networking
- 6. AWS Databases
- 7. Elastic Load Balancing and Amazon EC2
- 8. Auto Scaling
- 9. Content Delivery and DNS Services
- 10. Monitoring and Logging Services
- 11. Notification Services
- 12. AWS Billing and Pricing
- 13. AWS Security
- 14. AWS Shared Responsibility Model
- 15. Architecting for the Cloud
- 16. Additional AWS Services & Tools
- 17. AWS Analytics
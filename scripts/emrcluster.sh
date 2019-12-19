http://docs.aws.amazon.com/cli/latest/reference/emr/create-cluster.html
http://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-work-with-steps.html

Simple Cluster Creation in AWS India region

aws emr create-cluster --release-label emr-5.9.0  \
                        --instance-groups InstanceGroupType=MASTER,InstanceCount=1,InstanceType=m3.xlarge \
                        InstanceGroupType=CORE,InstanceCount=2,InstanceType=m3.xlarge --auto-terminate \
                        --region ap-south-1

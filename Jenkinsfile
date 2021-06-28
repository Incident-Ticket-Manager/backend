pipeline {
  agent any
  environment {
    AWS_DEFAULT_REGION = credentials('AWS_DEFAULT_REGION')
    aws_access_key = credentials('AWS_ACCESS_KEY_ID')
    aws_secret_key = credentials('AWS_SECRET_ACCESS_KEY')
    temporary_security_group_source_cidrs = credentials('SERVER_IP')
    app_port = '3000'
  }
  stages {
    stage("Clean Workspace"){
      steps {
        cleanWs()
      }
    }
    stage("Build AMI"){            
      steps {
        sh 'packer build buildAMI.json'
      }
    }
    stage("Deploy infra"){
      steps {
        dir("deploy-infra-itm"){
          sh 'terraform init'
          sh 'terraform plan'
          sh 'terraform apply -auto-approve'
        }
      }
    }
    stage("Deploy backend"){
      steps {
        dir("deploy-backend-itm"){
          sh 'terraform init'
          sh 'terraform plan'
          sh 'terraform apply -auto-approve'
        }
      }
    }
  }
}
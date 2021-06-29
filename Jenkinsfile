pipeline {
  agent any
  environment {
    AWS_DEFAULT_REGION = credentials('AWS_DEFAULT_REGION')
    AWS_ACCESS_KEY_ID = credentials('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
    DATABASE_URL = credentials('DATABASE_URL')
    temporary_security_group_source_cidrs = credentials('SERVER_IP')
    app_port = '3000'
    github_token = credentials('github_token')
  }
  stages {
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
    stage("Clean Workspace"){
      steps {
        cleanWs()
      }
    }
  }
}
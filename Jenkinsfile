pipeline {
  environment {
    imageName = 'thomaslacaze/itm-backend'
    registryCredential = 'dockerCredential'
    awsCredential = 'awsCredential'
    awsRegion = 'AWS_DEFAULT_REGION'
    bucketName = 'itm-backend'
  }

  agent any
  stages {

    stage('Display env') {
      steps {
        sh 'printenv'
      }
    }

    stage('Build & Deploy Image release') {
      when {
        tag '*'
      }
      steps {
        script {
          version = TAG_NAME
          versions = version.split('\\.')
          major = versions[0]
          minor = versions[0] + '.' + versions[1]
          patch = version.trim()
          docker.withRegistry('', registryCredential) {
            image = docker.build imageName+":latest"
            image.push()
            image.push(major)
            image.push(minor)
            image.push(patch)
          }
        }
      }
    }

    stage('Build & Deploy Image Dev') {
      when {
        branch 'develop'
      }
      steps {
        script {
          docker.withRegistry('', registryCredential) {
            image = docker.build imageName+":develop"
            image.push()
          }
        }
      }
    }
  }
}
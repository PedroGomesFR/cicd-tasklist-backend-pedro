pipeline {
  agent any

  environment {
    CI = 'true'
    IMAGE_NAME = 'cicd-tasklist-backend-pedro'
    PATH = '/opt/homebrew/bin:/usr/local/bin:/Applications/Docker.app/Contents/Resources/bin:/usr/bin:/bin:/usr/sbin:/sbin'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Verify Tools') {
      steps {
        sh 'which npm && npm -v'
        sh 'which docker && docker --version'
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Generate Prisma Client') {
      steps {
        sh 'npm run prisma:generate'
      }
    }

    stage('Run Unit Tests') {
      steps {
        sh 'npm run test'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Build Docker Image') {
      steps {
        sh 'docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} .'
      }
    }

    stage('Publish Docker Image') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_TOKEN')]) {
          sh 'echo "$DOCKERHUB_TOKEN" | docker login -u "$DOCKERHUB_USER" --password-stdin'
          sh 'docker tag ${IMAGE_NAME}:${BUILD_NUMBER} ${DOCKERHUB_USER}/${IMAGE_NAME}:${BUILD_NUMBER}'
          sh 'docker tag ${IMAGE_NAME}:${BUILD_NUMBER} ${DOCKERHUB_USER}/${IMAGE_NAME}:latest'
          sh 'docker push ${DOCKERHUB_USER}/${IMAGE_NAME}:${BUILD_NUMBER}'
          sh 'docker push ${DOCKERHUB_USER}/${IMAGE_NAME}:latest'
        }
      }
    }
  }

  post {
    always {
      junit allowEmptyResults: true, testResults: 'reports/junit.xml'
      archiveArtifacts artifacts: 'coverage/**', allowEmptyArchive: true
      sh 'docker logout || true'
    }
  }
}

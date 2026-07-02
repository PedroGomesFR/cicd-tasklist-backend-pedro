pipeline {
  agent any

  environment {
    CI = 'true'
    IMAGE_NAME = 'cicd-tasklist-backend-pedro'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
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
        script {
          dockerImage = docker.build("${env.IMAGE_NAME}:${env.BUILD_NUMBER}")
        }
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

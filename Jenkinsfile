pipeline {
  agent any
  environment {
    DOCKERHUB = credentials('dockerhub-creds') // set in Jenkins
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Build Backend Image') {
      steps {
        sh 'docker build -t $DOCKERHUB_USR/swe645-backend:${BUILD_NUMBER} ./backend'
        sh 'docker tag $DOCKERHUB_USR/swe645-backend:${BUILD_NUMBER} $DOCKERHUB_USR/swe645-backend:latest'
      }
    }
    stage('Build Frontend Image') {
      steps {
        sh 'docker build -t $DOCKERHUB_USR/swe645-frontend:${BUILD_NUMBER} ./frontend'
        sh 'docker tag $DOCKERHUB_USR/swe645-frontend:${BUILD_NUMBER} $DOCKERHUB_USR/swe645-frontend:latest'
      }
    }
    stage('Push Images') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKERHUB_USR', passwordVariable: 'DOCKERHUB_PSW')]) {
          sh 'echo $DOCKERHUB_PSW | docker login -u $DOCKERHUB_USR --password-stdin'
          sh 'docker push $DOCKERHUB_USR/swe645-backend:latest'
          sh 'docker push $DOCKERHUB_USR/swe645-frontend:latest'
        }
      }
    }
    stage('Deploy to Kubernetes') {
      steps {
        // assumes kubeconfig available in Jenkins as credential or agent has kubectl
        sh 'kubectl apply -f k8s/backend-deployment.yaml'
        sh 'kubectl apply -f k8s/backend-service.yaml'
        sh 'kubectl apply -f k8s/frontend-deployment.yaml'
        sh 'kubectl apply -f k8s/frontend-service.yaml'
      }
    }
  }
}

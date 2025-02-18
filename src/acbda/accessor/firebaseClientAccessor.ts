import admin from 'firebase-admin';
import 'dotenv/config';

const serviceAccount = {
  "type": "service_account",
  "project_id": "inkhub-admin-v3-746a2",
  "private_key_id": "ef676237137813b45787c5ec332cd0f9d0986c67",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC2Yz/r8lKT/+Pd\nd0HMldi1PoLBuC3P60sbCLY7LTiNudf7FYd7itn9gGxN/j3wfAcvdcB+sn8VDmty\nnShtphv4pKVj7JJYfNgPPnnWfV7XxQ+G4wfNauKj5ajm7sR8DBGbxOIsvlOJWGt9\n9Z3TW/S21F+QKndrFbto+S21yF1ey3fo9j8EKJRypodhe229SyYy4Nn1O50TI1QU\nD1gA3w5uWEsyQZUjfCB8KMBmwZZvxaL+UWtFIxCpTcglCy7YIZLfZDXMFvKvPUtJ\nUpAOZV1FS3Fz+HV/AsWL+ul1zDAUm/JPlGjsxh5INKO7TMmZyD6pUGara1Ml5UoK\ni9+WD7rVAgMBAAECggEAWAyRAuCgwgcyY6ubjd83V8Q+TrQSFcKzJvFtPCNIHo99\n9558ogU12L5jSsG2+D6AH4bar6+PT0R/Vb0OE+UxsrcViyhdvC9FBRL1sbkjjMn7\nBXTbwuzbTiFkiVvyaipPY+JICC632GHhvtTQ5QULHipnmgsOTJmYuIQ273+zp7uC\n3lssjgJCiHHMd1VO81bHK2OzqImEMKqM3cVJ7vOAhmAmsSuVG+ZWkZzh0WtO7Ns/\nsLTXNOHru7TWHf/1AG1jQxuvs98u79GDnmEF3PAxjN+iu2mXAF9g6Tx73qrXznOm\nFyYbUAuXPmMNZQGj8sx5Bfrnenrk/n1mtob9unhN7wKBgQD4G7EFojLGFeCPCEQn\nqrnkOQ66Bq6jE6BHQb8i1HcQAQa3mekd0HTwHl9+AOv+hm2uh4aVZSWIs3MQMdRO\n2Zcsyty3OQb0wfISwsxQ4Gl8avMJEpcT3UIgQz9hwJ9kUYo3/sFg7E2YAtHLVz4d\nDikQ2fECruRUiN6niorsFXcecwKBgQC8MGfu1s4/MxA//R8P2tgV9hd5ziKVuETo\nZkaMiNGXSW6NI7zybmKz+C3ATDMiqFb/8SqhXSzwDigGeXVTDyD/oHdvPJpHl1Go\ndG1EQ/CBhgDH7nKLQBP8HsNk46BDvCW8zSnVB16X3rpgN39mWlmMvizHdpAeK7oR\ndDqkDqHnlwKBgDgnhFRjFpzQvMeCtnJH6NTnuRaPhp0wRvl5vvnyHpSHtu59Lk7q\nLF1gcnqBWOh9ont6/xH3F5yuCN/kd0n1Y4rmyzfI93MUJmbqofW4JQfc6O7nvzvm\nux20Orc0Mp8w+VidF0WJljJOiQ89yrgmyVKgETVrQhCD/ejrqW+vmAtTAoGBAKuo\na+WMwu0bIwN7XE4WDW1a4OcWhK2VPCXQxSGD28roDJNpufxZfGc1RmZWG37Nly43\nSe+PEmKWRyRAvihZcHw8XzV0TjZnbPD/4nuWjVdYaHX2pz0l4hTj6s+oYpPml3W0\nnyfWZQ6a9960QN2YJH8hKa94EtWyhTNOlf736e9ZAoGARIbl8VOeBwguPRzrKWDW\n7aPI7T7GZ0Si91fsVzjL6EkWt/ltmpaigml1q5CmuiTxNHJncgyRAVXjRXe7WGF3\nbdQZijKDmgeiYnXiMn3l0n8fX1PphGbf/37g2etRDEj+Pb3vDHxngs8ISrPT+gOD\nnoBLMAqYYtwGpyNPYC5PwHw=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@inkhub-admin-v3-746a2.iam.gserviceaccount.com",
  "client_id": "116501367313511064835",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40inkhub-admin-v3-746a2.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
} as admin.ServiceAccount;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

export { db, admin }; 
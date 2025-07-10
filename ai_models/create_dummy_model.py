import tensorflow as tf

# Create a simple model
model = tf.keras.models.Sequential([
  tf.keras.layers.Dense(10, activation='relu', input_shape=(4,)),
  tf.keras.layers.Dense(1, activation='sigmoid')
])

# Convert the model to TensorFlow Lite format
converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()

# Save the model to a file
with open('power_optimizer.tflite', 'wb') as f:
  f.write(tflite_model)

print("Successfully created dummy power_optimizer.tflite model.")

// import component React Native
import { View, Text, TextInput, Button, ToastAndroid, TouchableOpacity, Image } from 'react-native';

// import hook useState
import React, { useState } from 'react';

// import react native image picker
import { launchImageLibrary } from 'react-native-image-picker';

// import api
import Api from '../../services/api';

// import style
import styles from '../../styles';

// import handler error
import { handleErrors } from '../../utils/handleErrors';

export default function PostCreate({ navigation }) {
  // init state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({}); // PASTIIN INI ISI OBJECT PASALNYA/PASTI {}

  // method handleChoosePhoto
  const handleChoosePhoto = () => {
    launchImageLibrary({ noData: true }, (response) => {
      if (response && !response.didCancel) {
        setImage(response);
      }
    });
  };

  // method storePost
  const storePost = async () => {
    const formData = new FormData();

    formData.append('title', title);
    formData.append('content', content);

    if (image && image.assets && image.assets[0]) {
      formData.append('image', {
        uri: image.assets[0].uri,
        type: image.assets[0].type,
        name: image.assets[0].fileName || 'upload.jpg',
      });
    }

    try {
      await Api.post('/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      ToastAndroid.show('Post Created Successfully!', ToastAndroid.LONG);
      navigation.push('PostIndex');
    } catch (error) {
      console.log('Error Catch:', error?.response?.data);
      if (error?.response?.data) {
        handleErrors(error.response.data, setErrors);
      } else {
        ToastAndroid.show('Gagal terhubung ke Server!', ToastAndroid.LONG);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={styles.upload}>
          <Button title="Choose Image" color="gray" onPress={handleChoosePhoto} />
        </View>

        {/* Tampilkan Preview Gambar jika gambar dipilih */}
        {image && image.assets && image.assets[0] && (
          <Image
            source={{ uri: image.assets[0].uri }}
            style={{ width: '100%', height: 150, borderRadius: 10, marginBottom: 10 }}
          />
        )}

        {errors?.image && <Text style={styles.error}>{errors?.image}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Title"
          defaultValue={title}
          onChangeText={(value) => setTitle(value)}
        />
        {errors?.title && <Text style={styles.error}>{errors?.title}</Text>}

        <TextInput
          style={styles.textarea}
          placeholder="Content"
          defaultValue={content}
          onChangeText={(value) => setContent(value)}
        />
        {errors?.content && <Text style={styles.error}>{errors?.content}</Text>}

        <View style={{ padding: 10 }}>
          <TouchableOpacity style={styles.button} onPress={storePost}>
            <Text style={styles.buttonText}>SAVE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
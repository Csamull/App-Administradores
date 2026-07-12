import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import * as SplashScreen from 'expo-splash-screen';

export default function Index() {
  const router = useRouter();
  const [showText, setShowText] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const splashContainerFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Hide the native splash screen after mounting
    SplashScreen.hideAsync();

    // Fade in and scale up the logo
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // Show text after 1s
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 1000);

    // Fade out the whole splash container before routing
    const fadeOutTimer = setTimeout(() => {
      Animated.timing(splashContainerFade, {
        toValue: 0,
        duration: 700,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        router.replace('/login');
      });
    }, 2800);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(fadeOutTimer);
    };
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: splashContainerFade }]}>
      <Animated.Image
        source={require('@/assets/logo_matrip.png')}
        style={[
          styles.logo,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
        resizeMode="contain"
      />
      {showText && (
        <View style={styles.textContainer}>
          <Text style={styles.title}>Bem-vindo ao Matrip</Text>
          <Text style={styles.subtitle}>Sua próxima aventura começa aqui</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 260,
    height: 260,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 15,
    color: '#666666',
    marginTop: 6,
  },
});

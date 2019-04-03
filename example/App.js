/* eslint-disable jsx-a11y/accessible-emoji */
/* eslint-disable no-use-before-define */
/* eslint-disable react/jsx-filename-extension */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableHighlight,
} from 'react-native';
import BiometricAuthentication from 'react-native-biometric-authentication';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      hasBiometricAuthentication: false,
      biometricType: 'None',
    };
  }

  componentWillMount() {
    BiometricAuthentication.hasBiometricAuthentication()
      .then((hasBiometricAuthentication) => {
        if (hasBiometricAuthentication) {
          BiometricAuthentication.biometricType()
            .then((biometricType) => {
              this.setState({
                hasBiometricAuthentication,
                biometricType,
              });
            })
            .catch((error) => {
              this.setState({
                biometricType: error.code,
              });
            });
        }
      });
  }

  async authenticate() {
    if (await BiometricAuthentication.hasBiometricAuthentication()) {
      try {
        const isAuthenticated = await BiometricAuthentication.authenticate('Authenticate to continue...');
        Alert.alert(isAuthenticated ? 'Authenticated!' : 'Could not authenticate.');
      } catch (error) {
        Alert.alert('Authentication error', `Could not authenticate! ${error.message} - ${error.code}`);
        if (error.code.indexOf('denied') !== -1) {
          this.setState({
            biometricType: 'User denied the use of biometry.',
          });
        }
      }
    } else {
      Alert.alert('Biometrics not available', "This device doesn't support any biometric authentication methods.");
    }
  }

  displayBiometricsMessage() {
    const { hasBiometricAuthentication, biometricType } = this.state;
    if (hasBiometricAuthentication) {
      return (
        <View>
          <Text style={styles.normal}>
            Your device supports the following
            {' '}
            {'\n'}
            {' '}
  Biometric Authentication:
          </Text>
          <Text style={styles.biometricType}>
            { biometricType }
          </Text>
          <TouchableHighlight style={styles.button} onPress={() => this.authenticate()}>
            <Text>
              Tap to Authenticate
            </Text>
          </TouchableHighlight>

        </View>
      );
    }
    return (
      <View>
        <Text style={styles.normal}>
        Your device does not appear to support Biometric Authentication or it is disabled.
        </Text>
        <Text style={styles.bigEmoji}>🤷</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {'React Native \nBiometric Authentication'}
        </Text>
        {this.displayBiometricsMessage()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingTop: 120,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    paddingBottom: 30,
  },
  normal: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  bigEmoji: {
    textAlign: 'center',
    fontSize: 70,
  },
  biometricType: {
    fontWeight: 'bold',
    margin: 10,
    padding: 15,
    textAlign: 'center',
  },
  button: {
    margin: 20,
    padding: 20,
    backgroundColor: '#ABB8C3',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
});

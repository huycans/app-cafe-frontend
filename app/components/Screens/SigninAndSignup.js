//@flow
import React, { Component } from "react";
import { Text, View, TouchableHighlight, TextInput, Image } from "react-native";

import { connect } from "react-redux";
import styles from "./Styles.js";
import { signinRequest } from "../../actions/auth";

type PropType = {
  navigation: Function,
  dispatch: Function
};

type StateType = {
  email: string,
  password: string
};

//the first screen that welcome the user when they are not signed in
class SigninAndSignup extends Component<PropType, StateType> {
  handleInputEmail: Function;
  handleInputPassword: Function;
  constructor(props: PropType) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };

    this.handleInputEmail = this.handleInputEmail.bind(this);
    this.handleInputPassword = this.handleInputPassword.bind(this);
  }

  handleInputEmail(text: string) {
    this.setState({ email: text });
  }

  handleInputPassword(text: string) {
    this.setState({ password: text });
  }

  render(): void {
    const { navigation } = this.props;
    const EMAIL = "EMAIL",
      FACEBOOK = "FACEBOOK",
      GOOGLE = "GOOGLE";
    const { email, password } = this.state;

    return (
      <Image
        source={require("../../img/vertical-background.png")}
        style={styles.container}
      >
        <View style={styles.signinBoxCtn}>
          <TextInput
            autoCorrect={false}
            placeholder="Email"
            style={styles.input}
            keyboardType={"email-address"}
            onChangeText={(text: string): void => this.handleInputEmail(text)}
            value={this.state.email}
          />
          <TextInput
            autoCorrect={false}
            placeholder="Password"
            style={styles.input}
            onChangeText={(text: string): void =>
              this.handleInputPassword(text)
            }
            value={this.state.password}
            secureTextEntry={true}
          />
          <TouchableHighlight
            style={[styles.button, styles.signinButton]}
            onPress={(): void =>
              this.props.dispatch(signinRequest(EMAIL, { email, password }))
            }
            underlayColor="transparent"
            activeOpacity={0.5}
            disabled={email === "" || password === "" || false}
          >
            <Text style={styles.baseText}>Đăng nhập</Text>
          </TouchableHighlight>
        </View>

        <View style={styles.logoCtn}>
          <TouchableHighlight
            style={styles.button}
            onPress={(): void => this.props.dispatch(signinRequest(FACEBOOK))}
            underlayColor="transparent"
            activeOpacity={0.5}
          >
            <Image
              source={require("../../img/facebookLogo.png")}
              style={styles.logo}
            />
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.button}
            onPress={(): void => this.props.dispatch(signinRequest(GOOGLE))}
            underlayColor="transparent"
            activeOpacity={0.5}
          >
            <Image
              source={require("../../img/googleLogo.png")}
              style={styles.logo}
            />
          </TouchableHighlight>
        </View>

        <View style={styles.forgetPassword}>
          <TouchableHighlight
            style={[styles.button, { flex: 1 }]}
            onPress={(): void => navigation.navigate("EmailSignup")}
            underlayColor="transparent"
            activeOpacity={0.5}
          >
            <Text style={styles.smallText}>Đăng ký bằng Email</Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={[styles.button, { flex: 1 }]}
            onPress={(): void => alert("nothing yet")}
            underlayColor="transparent"
            activeOpacity={0.5}
          >
            <Text style={styles.smallText}>Quên mật khẩu?</Text>
          </TouchableHighlight>
        </View>
      </Image>
    );
  }
}

export default connect()(SigninAndSignup);

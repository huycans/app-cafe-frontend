//@flow
import React, { Component } from "react";
import { Text, View, TouchableHighlight, TextInput, Image } from "react-native";
import styles from "./Styles.js";
import { baseFontSize } from "./Styles";
import { connect } from "react-redux";
import { signupRequest } from "../../actions/auth";
type PropType = {
  navigation: Function,
  dispatch: Function
};
type StateType = {
  email: string,
  password: string,
  validationError: string
};

//screen used for signing in
class EmailSignup extends Component<PropType, StateType> {
  handleInputEmail: Function;
  handleInputPassword: Function;
  validateInput: Function;
  constructor(props: PropType) {
    super(props);
    this.state = {
      email: "",
      password: "",
      validationError: ""
    };
    this.handleInputEmail = this.handleInputEmail.bind(this);
    this.handleInputPassword = this.handleInputPassword.bind(this);
    this.validateInput = this.validateInput.bind(this);
  }

  handleInputEmail(text: string) {
    this.setState({ email: text });
  }

  handleInputPassword(text: string) {
    this.setState({ password: text });
  }

  validateInput() {
    const { email, password } = this.state;
    //use regex to test email input
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(this.state.email)) {
      if (this.state.password.length > 5) {
        this.setState({ validationError: "" });
        this.props.dispatch(signupRequest({ email, password }));
      } else {
        this.setState({
          validationError: "Password must be at least 6 characters"
        });
      }
    } else {
      this.setState({ validationError: "Invalid email address" });
    }
  }
  render(): void {
    const { navigation } = this.props;
    const validationError = (
      <Text style={{ textAlign: "center", color: "red" }}>
        {this.state.validationError}{" "}
      </Text>
    );
    return (
      <Image
        source={require("../../img/signup_bg_vertical.png")}
        style={styles.container}
      >
        <View style={styles.signupScreenCtn}>
          <TextInput
            autoCorrect={false}
            placeholder="email@email.com"
            style={[styles.input, styles.signupInput]}
            keyboardType={"email-address"}
            onChangeText={(text: string): void => this.handleInputEmail(text)}
            value={this.state.email}
            placeholderTextColor="white"
          />

          <TextInput
            autoCorrect={false}
            placeholder="your password"
            style={[styles.input, styles.signupInput]}
            onChangeText={(text: string): void =>
              this.handleInputPassword(text)
            }
            value={this.state.password}
            secureTextEntry={true}
            placeholderTextColor="white"
          />

          <View style={{ marginTop: 20 }}>
            <TouchableHighlight
              style={[styles.button, styles.signupButton]}
              onPress={(): void => this.validateInput()}
              underlayColor="transparent"
              activeOpacity={0.5}
            >
              <Text style={[styles.baseText, { fontSize: baseFontSize + 8 }]}>
                Đăng ký
              </Text>
            </TouchableHighlight>

            <TouchableHighlight
              style={[styles.button, styles.returnButton]}
              onPress={(): void => navigation.goBack()}
              underlayColor="transparent"
              activeOpacity={0.5}
            >
              <Text style={[styles.baseText, { fontSize: baseFontSize + 8 }]}>
                Quay lại
              </Text>
            </TouchableHighlight>
          </View>
          {validationError}
        </View>
      </Image>
    );
  }
}

export default connect()(EmailSignup);

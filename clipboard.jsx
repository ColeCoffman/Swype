export default class Homescreen extends Component {
  constructor() {
    super();
    this.state = {
      message: " ",
    };
  }

  render() {
    return (
      // Container View
      <View style={styles.container}>
        <View style={{ alignItems: "flex-end" }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 20 }}>Login Screen: </Text>
            <TextInput
              style={{ height: 30, fontSize: 20, backgroundColor: "#ffffff" }}
              placeholder="Login Name"
              onChangeText={(val) => {
                this.changeLoginNameHandler(val);
              }}
            />
          </View>
          <Text style={{ fontSize: 20 }}> </Text>

          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 20 }}>Password: </Text>
            <TextInput
              style={{ height: 30, fontSize: 20, backgroundColor: "#ffffff" }}
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={(val) => {
                this.changePasswordHandler(val);
              }}
            />
          </View>
          <Text style={{ fontSize: 20 }}>{this.state.message} </Text>
        </View>

        <Button title="Do Login" onPress={this.handleClick} />
      </View>
    );
  }

  handleClick = async () => {
    try {
      // modify obj based on json message
      var js =
        '{"query" : "query{ login(login:\\"' +
        global.loginName.trim() +
        '\\", password: \\"' +
        global.password.trim() +
        '\\") {userId, token, tokenExpiration} }"}';
      //login:global.loginName.trim(),password:global.password.trim()
      //var js = JSON.stringify(obj);
      // modify link based on api
      console.log(js);
      const response = await fetch("https://largeproject.herokuapp.com/api", {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });

      var res = JSON.parse(await response.text());
      console.log(res); // return package
      //console.log(res.data.login);
      //console.log(res.data.login.userId);
      if (res.data.login.userId <= 0) {
        this.setState({ message: "Usere/Password combination incorrect" });
      } else {
        global.firstName = res.firstName;
        global.lastName = res.lastName;
        global.userId = res.id;
        this.props.navigation.navigate("Main");
      }
    } catch (e) {
      this.setState({ message: e.message });
    }
  };

  changeLoginNameHandler = async (val) => {
    global.loginName = val;
  };

  changePasswordHandler = async (val) => {
    global.password = val;
  };
}

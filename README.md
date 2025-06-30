# Project Creation

- npx @react-native-community/cli init MyTestReactNative --version 0.80.0

# Environment

- java 21
- node 22
- gradle 8.14.1 (Check android/gradle/wrapper/gradle-wrapper.properties)

# Run Project

Check Version

```
java -version
node -v
```

Switch version in Mac

```
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
nvm use 22
nvm alias default 22
```

- yarn pod-install
- yarn android
- yarn ios --simulator "iPhone 16 Pro"

# Project Branching

- main (The main for release, versioning tag here)
- develop/master (Development Should be done in here)
- develop/feature (Specific Function)

# Rename

- npx react-native-rename "MT RN" -b "my.test.reactnative"

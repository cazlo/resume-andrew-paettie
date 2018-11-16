# What is this?
So this is basically a hack to extend the webpack config with the goal
of avoiding ejecting `create-react-app`.  It's nice to have easily updated
webpack scripts managed by a team of people other than me :D

# How it's used in this project


# Limitations
It doesn't work great with stest because the argument
used to call `customised-config.js`, e.g. `int` or `test`
is sent as a test filter, which doesn't match anything or matches
more than intended.
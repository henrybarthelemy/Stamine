# Stamine
State Machine Language Visualizer

## Languages
States are specified in a list format in the first line of the code file
Following lines can follow either the form
```
[StateFrom] goes to [StateTo] on [Input]
```
or
```
[StateFrom] [Input] -> [StateTo]"
```

for various states ``[State1]`` and ``[State2]``. Each state specified in transitions must be in the state list.

### Example code
```
states = [5, 6, 7]
5 goes to 6 on "a"
6 goes to 7 on "b"
```

When finished and you'd like to visualize, simply hit "Visualize Changes"

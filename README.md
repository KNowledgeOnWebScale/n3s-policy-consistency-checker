# Deontic examples using RDF Surfaces

Some examples how to implement deontic rules using RDF Surfaces.

## Install

Install https://github.com/eyereasoner/eye

This code was tested on EYE versions:

- EYE v10.30.16 (2024-12-09)
- EYE v11.5.3 (2025-01-29)

## Description

In our experiment we need multiple runs to execute deontic rules:

1. Run 1: compile `:obligation`, `:permission` and `:prohibition` into necessity `:box` ([]) statements. Compilation turns these deontic statements into RDF Surfaces with modal necessitity ([]) operators.
2. Run 2: apply the deontic rules in RDF Surface and check for policy inconsistencies
3. Run 3: apply the RDF Surfaces on the consequences in the next world and check for inconsistencies

## Usage

Create an N3 document containing a mix of `:obligation`, `:permission` and `:prohibition` statements as in:

```
:policy1 :permission { :Bob :buy :Alcohol . } .
:policy2 :prohibition { :Bob :buy :Alcohol . } .
```

optionally add triples that are available in the `:next_world`:

```
:next_world :contains {
    :Bob :can :Drink .
} .
```

See `examples/n3/example4_FAIL.n3` for an example of this last step.

Run the `./bin/run.sh` script on this N3S file to see if it leads to a contradiction or not.

The compilated `:box` of run 1 can be seen in the `.compiled.n3s` file. The normative world of run 2 can be seen in the `.world.n3s` file.

To run all N3 examples execute:

```
make n3
```

## ODRL

The folder `examples/odrl` contains [ODRL](https://www.w3.org/TR/odrl-model/) examples for policy consistency checks.

These examples can be compiled into N3 using:

```
./bin/run_odrl.sh examples/odrl/example01_FAIL.ttl
```

To run a consistency check on such a policy run:

```
./bin/run_odrl.sh examples/odrl/example01_FAIL.ttl check
```

To run a consistency check on a policy with a data file run:

```
./bin/run_odrl.sh -d examples/odrl/example04_data.ttl odrl/example04_FAIL.ttl
```

To run all ODRL examples execute:

```
make odrl
```
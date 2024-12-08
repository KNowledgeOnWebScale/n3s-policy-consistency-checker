# Deontic examples using RDF Surfaces

Some examples how to implement deontic rules using RDF Surfaces.

## Description

In our experiment we need multiple runs to execute deontic rules:

1. Run 1: compile `:obligation`, `:permission` and `:prohibition` into necessity `:box` ([]) statements. Compilation turns these deontic statements into RDF Surfaces with modal necessitity ([]) operators.
2. Run 2: apply the deontic rules in RDF Surface and check for policy inconsistencies
3. Run 3: apply the RDF Surfaces on the consequences in the next workd and check for inconsistencies

## Usage

Create an N3 document containing a mix of `:obligation`, `:permission` and `:prohibition` statements as in:

```
() :permission { :Bob :buy :Alcohol . } .
() :prohibition { :Bob :buy :Alcohol . } .
```

optionally add triples that are available in the `:next_world`:

```
:next_world :contains {
    :Bob :can :Drink .
} .
```

See `examples/example4_FAIL.n3` for an example of this last step.

Run the `./run.sh` script in this N3S file to see if it leads to a contradiction or not.

The compilated `:box` of run 1 can be seen in the `.run.n3s` file.
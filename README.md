# Deontic examples using RDF Surfaces

Some examples how to implement deontic rules using RDF Surfaces.

## Description

In our experiment we need multiple runs to execute deontic rules:

1. Run 1: compile `:obligation`, `:permission` and `:prohibition` into necessity `:box` ([]) statements (possibly negated)
2. Run 2: apply the deontic rules:
    - [] \phi in one `:world` makes \phi true in `:next_world`.
    - <> \phi = ~[]~\phi in one `:world` makes \phi true in `:next_world` (deontic axiom).

## Usage

Create an N3S document containing a mix of `:obligation`, `:permission` and `:prohibition` statements as in:

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

Run the `./run.sh` script in this N3S file to see if it leads to a contradiction or not.

The compilated `:box` of run 1 can be seen in the `.run.n3s` file.
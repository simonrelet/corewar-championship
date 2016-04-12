# The Corewar Championship

The Pit is the assembler program of the Corewar Championship, it will transform
your assembly ship into a core ship. This is the first step to becoming a
legend.

One can feel strong enough to write a ship directly in the core format, but
for the others you should write it in the assembly language described here and
use the Pit to create the core ship.

## The Assembly Syntax
### The Basics

To be valid, an assembly ship must:
  * Have a name and contains at least one instruction;
  * Only have one instruction, label or guildeline per line.

#### Line Comments

Line comments are characters ignored by the Pit and will therfore not be
visible in the core ship. They start at the first `#` character and will end
at the first line ending or at the end of the file.

For example:
```
mov r4, r6  # It's gonna rock!
```

#### Instruction

An instruction is composed of an opcode followed by arguments. The arguments
are separated by commas (`,`).

For example:
```
mov r4, r15    # Opcode 'move' with arguments 'r4' and 'r15'
mov r4 r15     # Syntax error
mov, r4, r15   # Syntax error
mov r4, , r15  # Syntax error
```

#### The Nibble: Smalest Memory Unit

Through the Corewar Championship the smalest memory unit used is the nibble
('q', also know as a quartet). It has a length of 4 bits (half-byte) and can be
represented by a single hexadecimal character. Each address corresponds to a
single nibble.

So `0xf` is a nibble, and '4q' means '4 nibbles'.

#### The PC and W'O"

The PC is the program counter of the ship, it's value can increase or decrease
depending on the jumps and will always be in the range [0, 65 535].

The W'O" is the distance counter, it can only increase. This value represent
the distance traveled since the start of the race.

#### The Registers

Any ship has access to 16 registers of 4q. The first register is `r0` and the
last `r15`.

By default they are all set to zero.

#### The Buffer

A buffer is availble to any ship to store up to 64q. There are only 2
instructions to access it: `ldb` and `stb`. The buffer is circular, so writing
or reading past the end, will loop back to the start of the buffer. 

By default the buffer is set to zero.

#### The Flags

There are 2 flags (`Z` and `S`) of 1 bit which cannot be set directly. Some
instructions can updates theses flags depending on the result (`add` for
example) and others can test them (`bnz` for example).

The `Z` flag is set to `1` or `0` to notify whether the result is equals to `0`
or not, respectively.

The `S` flag is set to `1` or `0` to notify whether the result is strictly
negative or not, respectively.

By default `Z` and `S` are not set (`0`).

#### The Ship Modes

The ship mode is used by the Stadium to perform some optimisations. Depending
on it, some instructions will decode and/or execute faster while others can be
slower. It can be changed using the `mode` instruction.

Choose wisely the mode(s) of your ship.

#### The Modes Visibility: IDX

A ship's visibility isn't absolute, it cannot see everything on the track.
The current mode of the ship defines the visibility it has: the IDX.

The follwing rules are applies for read, write and jumps:
  * The lowest accessible address is PC - IDX;
  * The highest accessible address is PC + IDX - 1;
  * The accessible range is circular and 2 * IDX wide.

For example a ship in a mode with an IDX: 10 and a PC: 30 can read, write or
jump in the range [20, 39], which makes 20 possible addresses. This range is a
circular subset of the track which means that if the ships try to jumps with an
offset of 10 (to address 40) it will end up at address 20.

#### The Constants

Some instructions take constants as arguments, it's size (the number of
nibbles) and whether it is signed or unsigned (positive, negative) is defined
by the instruction.

A constant can be in decimal or in hexadecimal but then must be preceed by
`0x`.

For example:
```
ll r1, 1234
ll r1, 0xCaFe  # No case sensitivity.
ll r1, 1fff    # Syntax error
ll r1, 000042  # Just 42
ll r1, -1      # Still working
```

#### The labels

A label is an identifier whose value is the address of it's definition and can
be used as constants in any expressions. In the assembly file a label can be
referenced at any line, it doesn't have to be after it's definition.

The Pit will replace every use of a label by it's value before any expression
evaluation. There are only here to help writting and reading an assembly ship,
they were not be visible in the core ship.

A label must:
  * Start with a letter, can contains letters, numbers, or `_` and must finish
    with a letter or a number;
  * Be defined only once.

By the way, the first instruction of the assembly file is at address `0x0`.

Value examples:
```
foo:            # 'foo' equals to 0x0
    mov r0, r1
bar:            # 'bar' equals to 0x3,
                # because 'mov' has a size of 3q.
    nop
    nop
    nop
yeah:           # 'yeah' equals to 0x6,
                # because 'nop' has a size of 1.
```

Label definition examples:
```
kl34:   # This label is valid
K_4_Z:  # This one too
_mnp:   # Syntax error
mnp_:   # Syntax error
3go:    # Syntax error
kl34:   # Syntax error: already defined
```

#### The Expressions

Each time an instruction requires a constant value, an expression can be used.
They can contains constants values, labels and perform arithmetic operations
with them.

For example:
```
foo:
    ll r0, foo - (1 + 2 * 4) / 8    # Works with simple operators
    ll r0, foo ^ 2                  # Exponents also works
    ll r0, bar ^ (foo - 0xa) / bar  # Messy, but ok
bar:
```

#### The Guidelines

A guideline is an additional information concerning the ship, they can be seen
as 'meta-data'. They can be used anywhere in the code even though it is usual
to put them at the top of the assembly file. Using the same guildeline several
times won't create errors, only the last one found will be used. A guildeline
is case insensitive.

The Pit recognise the folowing guildlines:

##### Name
Syntax: `.name "Corewar 101"`. Max length: 32 characters.

Sets the name of the ship. This guildeline is mandatory for a ship. If the name
is bigger than 32 characters it will be truncated and a warning will be
produced.

Examples:
```
.name "Don't worry guys"         # Single quotes are valid
.name "The name is \"Awesome\""  # Double quotes must be escaped
.name "The \\"                   # Escape the backslash to display it
```

##### Comment
Syntax: `.comment "This ship is awesome"`. Max length: 128 characters.

Sets a comment for the ship. This guildeline is optional for a ship. If the
comment is bigger than 128 characters it will be truncated and a warning will
be produced.

Examples:
```
.comment "Don't worry guys"         # Single quotes are valid
.comment "The name is \"Awesome\""  # Double quotes must be escaped
.comment "The \\"                   # Escape the backslash to display it
```

## Encoding

| Instruction      | q0 | q1 | q2 | q3 | q4 | q5 | q6 |
|------------------|----|----|----|----|----|----|----|
| `crash`          |  0 |    |    |    |    |    |    |
| `nop`            |  1 |    |    |    |    |    |    |
| `and rx, ry`     |  2 | rx | ry |    |    |    |    |
| `or rx, ry`      |  3 | rx | ry |    |    |    |    |
| `xor rx, ry`     |  4 | rx | ry |    |    |    |    |
| `not rx, ry`     |  5 | rx | ry |    |    |    |    |
| `rol rx, n`      |  6 | rx |  n |    |    |    |    |
| `asr rx, n`      |  7 | rx |  n |    |    |    |    |
| `add rx, ry`     |  8 | rx | ry |    |    |    |    |
| `sub rx, ry`     |  9 | rx | ry |    |    |    |    |
| `cmp rx, ry`     |  a | rx | ry |    |    |    |    |
| `neg rx, ry`     |  b | rx | ry |    |    |    |    |
| `mov rx, ry`     |  c | rx | ry |    |    |    |    |
| `ldr rx, [ry]`   |  d | rx | ry |    |    |    |    |
| `str [rx], ry`   |  e | rx | ry |    |    |    |    |
| `ldb [rx], n, m` |  f |  0 | rx | n0 | n1 | m0 | m1 |
| `stb [rx], n, m` |  f |  1 | rx | n0 | n1 | m0 | m1 |
| `lc rx, n`       |  f |  2 | rx | n0 | n1 |    |    |
| `ll rx, n`       |  f |  3 | rx | n0 | n1 | n2 | n3 |
| `swp rx, ry`     |  f |  4 | rx | ry |    |    |    |
| `addi rx, n`     |  f |  5 | rx |  n |    |    |    |
| `cmpi rx, n`     |  f |  6 | rx |  n |    |    |    |
| `b rx`           |  f |  7 | rx |    |    |    |    |
| `bz rx`          |  f |  8 | rx |    |    |    |    |
| `bnz rx`         |  f |  9 | rx |    |    |    |    |
| `bs rx`          |  f |  a | rx |    |    |    |    |
| `stat rx, n`     |  f |  b | rx |  n |    |    |    |
| `check`          |  f |  c |    |    |    |    |    |
| `mode m`         |  f |  d |  m |    |    |    |    |
| `fork`           |  f |  e |    |    |    |    |    |
| `write rx`       |  f |  f | rx |    |    |    |    ||

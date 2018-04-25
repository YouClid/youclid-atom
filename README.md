# youclid-atom package

## Installation
```bash
cd ~/.atom/packages
# Create symlink to our package
ln -s /path/to/youclid/folder/youclid-atom youclid-atom
apm install
```

## Usage
NOTE: When you launch `atom`, you must be in an environment that has `youclid` installed in it.
This means that if you installed `youclid` into a virtual environment, you must launch `atom` from inside of that virtual environment.
For example:
```bash
workon youclid
atom
```

### Keyboard shortcuts
`ctrl+alt+m` will mark a file as a `youclid` file that will be auto-updated on file save.

`ctrl+alt+c` will compile the current open file and save it in `/tmp/youclid.html`.
Alternatively, you can manually click on `Packages->youclid-atom->Compile` to compile the current file.

`ctrl+alt+o` will compile and open the current open file.
Alternatively, you can manually click on `Packages->youclid-atom->Compile and Open` to compile the current file.

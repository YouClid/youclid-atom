'use babel';

function compileYouclid() {
    filePath = atom.workspace.getActiveTextEditor().getPath()
    var exec = require('child_process').exec

    // d will be the div that displays our status message
    let d;
    // Check if we have already created this div so that we don't add another
    if ((d = document.getElementById("div-youclid-status")) === null) {
        // If we haven't created the div before, create one
        d = document.createElement("div")
        d.id = "div-youclid-status"
        d.style.fontSize ='medium'
    }
    // Tell the user that we are compiling
    d.innerHTML = "Compiling " + filePath + "..."
    let options = {'item': d, 'visible': true}
    atom.workspace.addFooterPanel(options)

    // This allows us to grab errors messages from the command
    function puts(error, stdout, stderr) {
        if (stderr) {
            // Actually have newlines render as newlines
            d.innerHTML = stderr.replace(/\n/g, "<br>")
        }
        else { d.innerHTML = "Compilation successful!"
        }
    }

    // Run the command
    let child = exec("youclid " + filePath + " -o /tmp/youclid.html", puts);
    return child
}

let htmlpreview = null
function compileAndOpen() {
    child = compileYouclid()
    // Open up the HTML file if there was not an error
    child.on('exit', function(code, signal) {
        if (code == 0) {
            // Save a reference to the current text editor
            previous = atom.workspace.getActiveTextEditor()
            // Open the temporary file so we can use html preview
            atom.workspace.open("/tmp/youclid.html").then(function(editor) {
                uri = "html-preview://editor/" + editor.id
                // If we already had the preview open, hide it
                if (htmlpreview != null) {
                    atom.workspace.hide("html-preview://editor/" + htmlpreview.editorId)
                }
                // Open the preview
                atom.workspace.open(uri, {'split': 'right', 'searchAllPanes': true}).then(function(htmlPreviewView){
                    // render the HTML
                    htmlPreviewView.renderHTML()
                    // store the current reference to the preview
                    htmlpreview = htmlPreviewView
                })
            // then hide the temporary HTML file
            }).then(function(editor) {
                atom.workspace.hide("/tmp/youclid.html")
            // Then, reactivate the text editor
            }).then(function(editor) {
                atom.workspace.open(previous.getPath(), {'searchAllPanes': true})
            })
        }
    })
}

import { CompositeDisposable } from 'atom';

export default {

  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'youclid-atom:compile': () => this.compile(),
      'youclid-atom:compile_and_open': () => this.compile_and_open(),
      'youclid-atom:mark': () => this.mark()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  compile() {
        compileYouclid()
  },

  compile_and_open() {
    compileAndOpen()
  },

  mark() {
    atom.workspace.getActiveTextEditor().onDidSave(compileAndOpen)
  }
};

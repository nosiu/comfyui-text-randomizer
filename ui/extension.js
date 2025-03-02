import { app } from "../../scripts/app.js";


function checkBrackets(value, domWidget) {
  const input = value
  const resultMessage = domWidget.element
  const brackets = []
  const parentheses = []

  const unmatchedClosingBrackets = []
  const unmatchedClosingParentheses = []

  for (let i = 0; i < input.length; i++) {
    const char = input[i]

    if (char === '[') {
      brackets.push(i)
    }

    if (char === ']') {
      if (brackets.length === 0) {
        unmatchedClosingBrackets.push(i)
      } else {
        brackets.pop()
      }
    }

    if (char === '(') {
      parentheses.push(i)
    }

    if (char === ')') {
      if (parentheses.length === 0) {
        unmatchedClosingParentheses.push(i)
      } else {
        parentheses.pop()
      }
    }
  }

  let message = ""
  let hasErrors = false

  if (brackets.length > 0) {
    message += `Unmatched opening bracket at: ${brackets.map(p => p + 1).join(', ')}. `
    hasErrors = true
  }

  if (unmatchedClosingBrackets.length > 0) {
    message += `Unmatched closing bracket at: ${unmatchedClosingBrackets.map(p => p + 1).join(', ')}. `
    hasErrors = true
  }

  if (parentheses.length > 0) {
    message += `Unmatched opening parenthesis at: ${parentheses.map(p => p + 1).join(', ')}. `
    hasErrors = true
  }

  if (unmatchedClosingParentheses.length > 0) {
    message += `Unmatched closing parenthesis at: ${unmatchedClosingParentheses.map(p => p + 1).join(', ')}. `
    hasErrors = true
  }

  if (!hasErrors) {
    message = "All brackets and parentheses are properly matched!"
    resultMessage.style.color = "green"
  } else {
    resultMessage.style.color = "red"
  }

  resultMessage.value = message
  domWidget.value = message
}



app.registerExtension({
  name: "ComfyUI.text-randomizer-01",
  async beforeRegisterNodeDef(nodeType) {
    // ===================================
    // SHOW TEXT
    // ===================================
    if (nodeType?.comfyClass == "ShowText") {
      const onExecuted = nodeType.prototype.onExecuted
      nodeType.prototype.onExecuted = function (message) {
          const r = onExecuted?.apply(this, arguments)
          const text = message.text.join("") 
          if (text) {
            const previewWidget = this.widgets.find(w => w.name === "preview")
            previewWidget.value = text
          }
          return r
      }

      const onNodeCreated = nodeType.prototype.onNodeCreated
      nodeType.prototype.onNodeCreated = function () {
        const r = onNodeCreated ? onNodeCreated.apply(this, arguments) : undefined
        const previewWidget = this.widgets.find(w => w.name === "preview")
        if (previewWidget) {
          previewWidget.element.readOnly = true
        }
        return r
      }

      const onConnectionsChange = nodeType.prototype.onConnectionsChange;
      nodeType.prototype.onConnectionsChange = function (side, slot, connect, link_info, output) {
        const r = onConnectionsChange?.apply(this, arguments);
        if (output.name === "text") {
          const previewWidget = this.widgets.find(w => w.name === "preview")
          if (previewWidget) {
            previewWidget.value = ""
          }
        }
        return r
      }
    }


    // ===================================
    // RANDOMIZE TEXT
    // ===================================
    if (nodeType?.comfyClass == "RandomizeTextWithCheck") {
      const onNodeCreated = nodeType.prototype.onNodeCreated;
      nodeType.prototype.onNodeCreated = function () {
        const r = onNodeCreated ? onNodeCreated.apply(this, arguments) : undefined
        const textwWidget = this.widgets.find(w => w.name === "text")
        const infoTextWidget = this.widgets.find(w => w.name === "info_text")
        infoTextWidget.element.readOnly = true
        infoTextWidget.value = ""

        if (textwWidget) {
          const callback = textwWidget.element.onkeyup
          textwWidget.element.onkeyup = (e) => {
            checkBrackets(textwWidget.value, infoTextWidget)
            if (callback) callback(e)
          }
        }
        return r
      }

      const onGraphConfigured = nodeType.prototype.onGraphConfigured;
      nodeType.prototype.onGraphConfigured = function () {
        const r = onGraphConfigured?.apply(this, arguments)
        const textwWidget = this.widgets.find(w => w.name === "text")
        if (textwWidget) {
          checkBrackets(textwWidget.value, this.widgets.find(w => w.name === "info_text"))
        }
        return r
      }
    }
  }
})
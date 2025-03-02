import re
import random

CATEGORY_NAME = "randomizer"

class RandomizeText:
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "text": ("STRING", {"multiline": True}), 
                "seed": ("INT", {"default": 0, "min": 0, "max": 0xffffffffffffffff}),
            }
        }
    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("text",)
    FUNCTION = "randomize"

    CATEGORY = CATEGORY_NAME

    def randomize(self, text, seed, **kwargs):
        random.seed(seed)   

        while '[' in text:
            text = re.sub(r'\[([^\[\]]+)\]', lambda x: random.choice(x.group(1).split('|')), text)

        return (text,)


# ===========================================================================
class RandomizeTextWithCheck(RandomizeText):
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "text": ("STRING", {"multiline": True}), 
                "seed": ("INT", {"default": 0, "min": 0, "max": 0xffffffffffffffff}),
            },
            "optional": {
                "info_text": ("STRING", {"multiline": True}), 
            } 
        }

# ===========================================================================
class ConcatText:
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "text1": ("STRING", {"multiline": True, "forceInput": True}), 
                "text2": ("STRING", {"multiline": True, "forceInput": True}), 
            }
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("text",)
    FUNCTION = "concat"

    CATEGORY = CATEGORY_NAME

    def concat(self, text1, text2):
      return (text1 +  ", " + text2,)


# ===========================================================================
class RandomTextChoice:
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "text1": ("STRING", {"multiline": True, "forceInput": True}), 
                "text2": ("STRING", {"multiline": True, "forceInput": True}), 
                "seed": ("INT", {"default": 0, "min": 0, "max": 0xffffffffffffffff}),
            }
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("text",)
    FUNCTION = "choice"

    CATEGORY = CATEGORY_NAME

    def choice(self, text1, text2, seed):
        random.seed(seed)
        text = random.choice([text1, text2]) 
        return (text,)


# ===========================================================================
class ShowText:
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "text": ("STRING", {"forceInput": True, "dynamicPrompts": True}), 
            },
            "optional": {
                "preview": ("STRING", {"multiline": True }), 
            } 
        }
    
    RETURN_TYPES = ()
    FUNCTION = "showText"
    OUTPUT_NODE = True
    CATEGORY = CATEGORY_NAME

    def showText(self, text, **kwargs):
      return {"ui": {"text": text}}


NODE_CLASS_MAPPINGS = {
  "RandomizeText": RandomizeText,
  "RandomizeTextWithCheck": RandomizeTextWithCheck,
  "RandomTextChoice": RandomTextChoice,
  "ConcatText": ConcatText,
  "ShowText": ShowText,
}

NODE_DISPLAY_NAME_MAPPINGS = {
  "RandomizeText": "Text randomizer",
  "RandomizeTextWithCheck": "Text randomizer with check",
  "RandomTextChoice": "Get one text or another at random",
  "ConcatText": "Concatenate text",
  "ShowText": "Show text",
}
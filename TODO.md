
# Design:
- you will need to build the UI so it is optimized for mobile (verticle, no landscape)
- On desktop, everything should be centered on the middle of the screen and should never exceed a width of lets say... 768px (or whatever the tablet size is)


I would like to see the following steps appear as progress is made

## 1. Getting Started

This section should list out everything you need to complete the upload process

- a USB cable (detail which type of USB cable)
- Google Chrome
- Power supply for the module
- 


## 2A. Enter Bootloader Mode

## 2B. CONNECT button

Button should have some text underneath saying "select STM BOOTLOADER from the list and then press 'Connect' button"

After connection is made, we will parse through the list of DFU interfaces, and find:

```
DFU: cfg=1, intf=0, alt=0, name="@Internal Flash /0x08000000/04*016Kg,01*064Kg,03*128Kg"
```

If this is not found, show an error message saying "

## 3. Select File

There should be helper text explaining which file they need to select, and if they don't have access to it, then further details as to how to obtain the firmware file

## 4. Upload Button

- Disabled if no file is selected
- begin the upload process


## 5. Progress Bar

Shows the upload progress


## 6. Complete

If upload was a success, display a "complete" message, and then show some text explaining what the next steps should be (the module should auto-reset after upload, so the only step should be to disconnect the power supply and then disconnect the USB cable)

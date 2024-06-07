# Heron.BlazorQRScanner

A simple QR code scanner for Blazor.

The project is basically just a wrapper around the [jsQR](https://github.com/cozmo/jsQR) javascript library.

## Getting Started

Install the Heron.BlazorQRScanner package.

```razor
dotnet add package Heron.BlazorQRScanner
```

Add the following to `_Imports.razor`.

```razor
@using Heron.BlazorQRScanner
```

## Usage

The component has 2 properties `AutoStart` and `AutoStop` which are both true by default.  This means you can simply
place the `Scanner` component on a page and the camera will be opened and scanning started as soon the page is opened. 
Scanning will stop as soon as a QR Code is found.

A simple implementation looks like this

```razor
@if (string.IsNullOrEmpty(_code))
{
    <Scanner CodeFound="CodeFound" />   
}
else
{
    <div>
        Code = @_code
    </div>
}

@code
{
    private string _code = string.Empty;

    private void CodeFound(string code)
    {
        _code = code;
    }
}
```

Alternatively starting and stopping scanning can be done by calling the `Start` and `Stop` methods on the component.

## Support

For any issues or feature requests, please open a new issue on GitHub.

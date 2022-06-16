This documentation page lists and describes the step definitions available in this project.

# Navigation

### *Given* That I am on the {appName} home page
#### #NAV-1
Navigate to the home page of the specified application, and defines the current application being tested.

*Note : For a given application, the home page URL might vary depending on the current environment being tested.*

| Parameter Name | Description                     | Accepted Values |
|----------------|---------------------------------|-----------------|
| `appName`      | The application to navigate to. | `webapp`        |

Example : `Given That I am on the webapp home page`

### - *Given* That I am on mobile in {viewportMode} mode
#### #NAV-2
Switch to a mobile resolution, either in portrait or landscape mode.

*Note : The exact mobile resolution is 450*851px and is hardcoded in the tests for now.*

| Parameter Name | Description               | Accepted Values           |
|----------------|---------------------------|---------------------------|
| `viewportMode` | The viewport orientation. | `portrait` or `landscape` |

Example : `Given That I am on mobile in portrait mode`

### - *When* I rotate my device
#### #NAV-3
Rotate the device (switch the viewport orientation) when in mobile view.

*Prerequisite : You must already be in mobile mode by using the #NAV-2 step.*

Example : `When I rotate my device`

### - *Then* I should be in the home page
#### #NAV-4
Assert that you are effectively in the home page of the application being tested.

*Prerequisite : You must already have defined the current application being tested, using a step like #NAV-1 for
instance.*

Example : `Then I should be in the home page`

# DOM Manipulation

### *When* I click on the element containing "{content}"
#### #DOM-1
Click on the first element in the page that contains the specified content (**case sensitive**).

*Notes : This step will fail if the element isn't clickable (disabled, no pointer events...) or if no element has been
found.*

| Parameter Name | Description                                          | Accepted Values |
|----------------|------------------------------------------------------|-----------------|
| `content`      | The content (inner text) of the element to click on. | any `string`    |

Example : `When I click on the element containing "Sign In"`

### *When* I click on the menu item with the index {index}
#### #DOM-2
Click on the `index`-th menu item element (i.e. : element with the `[role="menuitem"]` attribute) on the page. Indexes
start at 0.

*Notes : This step will fail if the element isn't clickable (disabled, no pointer events...) or if no element has been
found.*

| Parameter Name | Description                                           | Accepted Values |
|----------------|-------------------------------------------------------|-----------------|
| `index`        | The index of the menu item to click on (starts at 0). | any `integer`   |

Example : `When I click on the menu item with the index 0`

### *When* I enter "{input}" in the prompt
#### #DOM-3
Enters the given input, and presses "OK" on a JavaScript prompt alert.

| Parameter Name | Description                                  | Accepted Values |
|----------------|----------------------------------------------|-----------------|
| `input`        | The input to enter in the JavaScript prompt. | any `string`    |

Example : `When I enter "My name is Donovan" in the prompt`

### *When* I cancel the prompt
#### #DOM-4
Presses "Cancel" on a JavaScript prompt alert and dismisses the prompt.

Example : `When I cancel the prompt`

### *Then* I should see an element containing "{content}"
#### #DOM-5
Assert that there is an element in the page that contains the specified content (**case sensitive**).

| Parameter Name | Description                              | Accepted Values |
|----------------|------------------------------------------|-----------------|
| `content`      | The content (inner text) of the element. | any `string`    |

Example : `Then I should see an element containing "Success !"`

### *Then* I should not see an element containing "{content}"
#### #DOM-6
Assert that there is NOT an element in the page that contains the specified content (**case sensitive**).

| Parameter Name | Description                              | Accepted Values |
|----------------|------------------------------------------|-----------------|
| `content`      | The content (inner text) of the element. | any `string`    |

Example : `Then I should not see an element containing "Unexpected error"`


# Webapp

### - *Given* That I am already connected
#### #WEBAPP-1
Create a new authentication token and stores it in the webapp local storage.

*Note : The credentials used to log in are the ones passed in the `AUTH0_USERNAME` and `AUTH0_PASSWORD` environment
variables.*

### - *When* I start a {inspectionType} inspection
#### #WEBAPP-2
Start a new inspection by clicking on the correct webapp menu item.

*Prerequisite : This step can be used if you are already in the webapp's home page.*

| Parameter Name   | Description                      | Accepted Values                                            |
|------------------|----------------------------------|------------------------------------------------------------|
| `inspectionType` | The type of inspection to start. | `VIN recognition`, `Damage detection` or `Wheels analysis` |

Example : `When I start a Damage detection inspection`

### - *Then* I should not have an authentication token stored in my browser
#### #WEBAPP-3
Asserts that no authentication token is stored in the webapp's local storage.

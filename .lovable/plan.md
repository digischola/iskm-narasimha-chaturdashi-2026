I agree this needs a different approach rather than another small CSS tweak.

What is happening:
- The white space is not just from our wrapper sizing; it is inside the Google Maps embed/frame behavior.
- The current `.loc-map` uses a fixed aspect-ratio box (`padding-bottom: 75%`) and the embedded Google map content does not reliably fill/crop the same way across loads/viewports.
- CSS around the iframe can reduce symptoms, but it cannot fully control Google’s internal rendered area, so repeated tweaks can still leave blank space.

Plan:
1. Replace the left-side embedded interactive Google Maps iframe with a controlled map preview block.
   - Use a static map-like visual/card or image-style preview that always fills the container with `object-fit: cover` / background cover.
   - Keep the whole map preview clickable and open Google Maps directions in a new tab.
   - Keep the “Get Directions” button on the right as-is.

2. Match the current design exactly.
   - Preserve the rounded corners, shadow, two-column layout, and the beige/cream event styling.
   - Make the map panel height align visually with the venue info card instead of creating a tall empty container.

3. Add a small overlay CTA on the map preview.
   - Example: “Open in Google Maps” / “View directions”.
   - This makes it clear that the map is actionable even if it is no longer an interactive iframe.

4. Mobile behavior.
   - On mobile, stack the map above the venue info.
   - Use a shorter fixed/min height so no whitespace appears there either.

5. Verify after implementation.
   - Check desktop and mobile preview screenshots at the Getting there section.
   - Confirm there is no blank white area below the map and that the directions link still opens Google Maps.
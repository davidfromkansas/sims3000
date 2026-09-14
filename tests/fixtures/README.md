# Ordinary city acceptance checkpoint

`ordinary-city-month-640.json.gz` is a compressed, unedited save from the project's ordinary city-growth audits. It contains only generated game state: a 256×256 city named “Normal growth audit,” month 640, 178,832 residents and §18,394,286, schema 142. It contains no account credentials or external application data.

Its construction history follows the metropolis, education/reward, garbage, port and Geyser Park milestones. The city was carried forward through save migrations as those features were implemented; this fixture is not presented as a single uninterrupted run of the current version from an empty map. The separate `test:metropolis` exercise verifies the fresh empty-map route to 150,000.

`npm run test:financial-center` loads this checkpoint, uses ordinary construction to expand three districts, exposes declining utility output, replaces old facilities, reaches 200,000, and places the earned Stock Exchange. It does not grant money, edit population or force reward eligibility. This is a longer optional acceptance run, separate from the default regression suite.

Uncompressed SHA-256: `973e7f70d3cd979134724afe2564977124a9e09b93b78fb25b7774e46da508e2`

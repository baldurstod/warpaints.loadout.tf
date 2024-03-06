export class ServerAPI {
	static async #fetchAPI(action, version, params) {
		let fetchOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(
				{
					action: action,
					version: version,
					params: params,
				}
			),
		};

		const response = await fetch('./api', fetchOptions);
		const json = await response.json();
		if (json.success) {
			return json.result;
		}
	}


	static async getWeapon(weapon, wear) {
		return this.#fetchAPI('get-weapon', 1,
			{
				weapon: weapon,
				wear: wear,
			}
		);
	}
}

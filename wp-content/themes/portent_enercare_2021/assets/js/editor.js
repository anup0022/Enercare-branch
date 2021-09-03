wp.domReady( () => {
	wp.blocks.unregisterBlockStyle(
		'core/button',
		[ 'default', 'outline', 'squared', 'fill' ]
	);

	wp.blocks.registerBlockStyle(
		'core/button',
		[
			{
				name: 'x-small',
				label: "Extra Small"
			},
			{
				name: 'small',
				label: 'Small'
			},
			{
				name: 'default',
				label: 'Default',
				isDefault: true,
			},
			{
				name: 'featured',
				label: 'Featured'
			},
			{
				name: 'hero',
				label: 'Hero'
			},
			{
				name: 'x-large',
				label: 'Extra Large'
			}
		]
	);

	wp.blocks.unregisterBlockStyle(
		'core/separator',
		[ 'default', 'wide', 'dots' ],
	);

	wp.blocks.unregisterBlockStyle(
		'core/quote',
		[ 'default', 'large' ]
	);

	wp.blocks.registerBlockStyle(
		'core/list',
		[
			{
				name: 'bulleted',
				label: 'Bulleted'
			},
			{
				name: 'checkmarked',
				label: 'Checkmarked'
			},
			{
				name: 'pros',
				label: 'Pros'
			},
			{
				name: 'cons',
				label: 'Cons'
			}
		]
	);

	wp.blocks.registerBlockStyle(
		'acf/card',
		[
			{
				name: 'plain',
				label: 'Plain'
			},
			{
				name: 'bordered',
				label: 'Bordered',
				isDefault: true,
			},
			{
				name: 'shadowed',
				label: 'Shadowed',
			}
		]
	);

} );

// Sample retrieve test

// this.sample = new Sample({
// 	_id: 'asfui3knaskjgfasfasg',
// 	sp_name: 'Test Sample',
// 	ed: new Eruption({_id: 'asgasgasg', ed_name: 'Eruption 1'}),
// 	vd: new Volcano({_id: 'askhfkg29gskangsag', vd_name: 'Volcano A'}),
// 	proj: new Project({_id: 'asdasgas', proj_name: 'PRoject123'}),
//
// 	sp_amount: 'amount ashdlasjkdjasd,',
// 	sp_collector: new User({us_name: 'nxphi47', us_email: 'nxphi47@mail.com'}),
// 	img: [
// 		new ImageModel({
// 			_id: '1asfasg2tas',
// 			img_name: 'image_1',
// 			img_cat: 'rocksample',
// 			img_url: '/assets/img/eos_logo.png',
// 			// img_url: '/assets/img/hauyen.jpg',
// 			cm_stage_x: 220,
// 			cm_stage_y: 110,
// 			cm_fullsize_w: 440,
// 			cm_fullsize_h: 220,
// 			sm_micron_bar: 0,
// 			sm_micron_marker: 1000,
// 			img_pix_w: 440,
// 			img_pix_h: 220,
// 			mapele_list: [new ImageModel({
// 				_id: '8785785',
// 				img_name: 'map 1',
// 				img_cat: 'rocksample',
// 				img_url: '/assets/img/eos_logo.png'
// 			}),
// 				new ImageModel({
// 					_id: '2222222',
// 					img_name: 'map 2',
// 					img_cat: 'rocksample',
// 					img_url: '/assets/img/eos_logo.png'
// 				}),],
// 			point_alys: [
// 				new Analysis({
// 					_id: '3t23gse', ref_id: 1, ref_name: 'aly2', color: 'blue', aly_type: 'type 1',
// 					aly_instrument: 'type 2', aly_comment: 'no comment',
// 					pos_x: 1.24, pos_y: 2.2, pos_pix_x: 200, pos_pix_y: 100,
// 					data: {'C2O': new AlyElement({
// 						ele_name: 'C2O',
// 						ele_unit: '%wt',
// 						ele_val: 90.23
// 					}), 'H2O': new AlyElement({
// 						ele_name: 'H2O',
// 						ele_unit: '%wt',
// 						ele_val: 32.23
// 					}), 'CAO': new AlyElement({ele_name: 'CAO', ele_unit: '%wt', ele_val: 61.23}),}
//
// 				}),
// 				new Analysis({
// 					_id: '23dsdsf', ref_id: 2, ref_name: 'aly3', color: 'blue', aly_type: 'type 1',
// 					aly_instrument: 'type 2', aly_comment: 'no comment',
// 					pos_x: 1.24, pos_y: 2.2, pos_pix_x: 250, pos_pix_y: 110,
// 					data: {'C2O': new AlyElement({
// 						ele_name: 'C2O',
// 						ele_unit: '%wt',
// 						ele_val: 5.23
// 					}), 'H2O': new AlyElement({
// 						ele_name: 'H2O',
// 						ele_unit: '%wt',
// 						ele_val: 73.23
// 					}), 'CAO': new AlyElement({ele_name: 'CAO', ele_unit: '%wt', ele_val: 47.23}),}
//
// 				}),
// 				new Analysis({
// 					_id: '32gsdfds', ref_id: 2, ref_name: 'aly4', color: 'blue', aly_type: 'type 1',
// 					aly_instrument: 'type 2', aly_comment: 'no comment',
// 					pos_x: 1.24, pos_y: 2.2, pos_pix_x: 210, pos_pix_y: 140,
// 					data: {'C2O': new AlyElement({
// 						ele_name: 'C2O',
// 						ele_unit: '%wt',
// 						ele_val: 31.23
// 					}), 'H2O': new AlyElement({
// 						ele_name: 'H2O',
// 						ele_unit: '%wt',
// 						ele_val: 44.23
// 					}), 'CAO': new AlyElement({ele_name: 'CAO', ele_unit: '%wt', ele_val: 65.23}),}
//
// 				}),
// 				new Analysis({
// 					_id: 'sdgqeash', ref_id: 3, ref_name: 'aly5', color: 'blue', aly_type: 'type 1',
// 					aly_instrument: 'type 2', aly_comment: 'no comment',
// 					pos_x: 1.24, pos_y: 2.2, pos_pix_x: 40, pos_pix_y: 134,
// 					data: {'C2O': new AlyElement({
// 						ele_name: 'C2O',
// 						ele_unit: '%wt',
// 						ele_val: 82.23
// 					}), 'H2O': new AlyElement({
// 						ele_name: 'H2O',
// 						ele_unit: '%wt',
// 						ele_val: 21.23
// 					}), 'CAO': new AlyElement({ele_name: 'CAO', ele_unit: '%wt', ele_val: 34.12}),}
//
// 				}),
// 				new Analysis({
// 					_id: '32hfdhdfgfsgdg', ref_id: 4, ref_name: 'aly6', color: 'blue', aly_type: 'type 1',
// 					aly_instrument: 'type 2', aly_comment: 'no comment',
// 					pos_x: 1.24, pos_y: 2.2, pos_pix_x: 100, pos_pix_y: 100,
// 					data: {'C2O': new AlyElement({
// 						ele_name: 'C2O',
// 						ele_unit: '%wt',
// 						ele_val: 50.2
// 					}), 'H2O': new AlyElement({
// 						ele_name: 'H2O',
// 						ele_unit: '%wt',
// 						ele_val: 41.2
// 					}), 'CAO': new AlyElement({ele_name: 'CAO', ele_unit: '%wt', ele_val: 12.23}),}
//
// 				}),
// 				new Analysis({
// 					_id: '32hsdndshdshgdsh3',
// 					ref_id: 5,
// 					ref_name: 'aly7',
// 					color: 'blue',
// 					aly_type: 'type 1',
// 					aly_instrument: 'type 2',
// 					aly_comment: 'no comment',
// 					pos_x: 1.24,
// 					pos_y: 2.2,
// 					pos_pix_x: 120,
// 					pos_pix_y: 150,
// 					data: {'C2O': new AlyElement({
// 						ele_name: 'C2O',
// 						ele_unit: '%wt',
// 						ele_val: 20.4
// 					}), 'H2O': new AlyElement({
// 						ele_name: 'H2O',
// 						ele_unit: '%wt',
// 						ele_val: 30.1
// 					}), 'CAO': new AlyElement({ele_name: 'CAO', ele_unit: '%wt', ele_val: 9.2}),}
//
// 				}),
// 			],
// 			charts: [
// 				new Chart({
// 					chart_name: 'test chart line',
// 					x_axix: 'pos_x',
// 					type: 'line',
// 					other_axes: ['data.C2O', 'data.H2O', 'data.CAO'],
// 					data_ids: ['3t23gse', '23dsdsf', '32gsdfds' ,'sdgqeash', '32hfdhdfgfsgdg', '32hsdndshdshgdsh3'],
// 					comment: 'testing'
// 				}),
// 				new Chart({
// 					chart_name: 'test chart bar',
// 					// x_axis: 'pos_x',
// 					type: 'bar',
// 					other_axes: ['data.C2O', 'data.H2O', 'data.CAO', 'pos_x'],
// 					data_ids: ['3t23gse', '23dsdsf', '32gsdfds' ,'sdgqeash', '32hfdhdfgfsgdg', '32hsdndshdshgdsh3'],
// 					comment: 'testing'
// 				}),
// 				new Chart({
// 					chart_name: 'test chart pie',
// 					// x_axis: 'pos_x',
// 					type: 'pie',
// 					other_axes: ['data.C2O', 'data.H2O', 'data.CAO', 'pos_x'],
// 					data_ids: ['3t23gse', '23dsdsf', '32gsdfds' ,'sdgqeash', '32hfdhdfgfsgdg', '32hsdndshdshgdsh3'],
// 					comment: 'testing'
// 				}),
// 				new Chart({
// 					chart_name: 'test chart doughnut',
// 					// x_axis: 'pos_x',
// 					type: 'doughnut',
// 					other_axes: ['data.C2O', 'data.H2O', 'data.CAO', 'pos_x'],
// 					data_ids: ['3t23gse', '23dsdsf', '32gsdfds' ,'sdgqeash', '32hfdhdfgfsgdg', '32hsdndshdshgdsh3'],
// 					comment: 'testing'
// 				}),
// 				new Chart({
// 					chart_name: 'test chart radar',
// 					// x_axis: 'pos_x',
// 					type: 'radar',
// 					other_axes: ['data.C2O', 'data.H2O', 'data.CAO', 'pos_x'],
// 					data_ids: ['3t23gse', '23dsdsf', '32gsdfds' ,'sdgqeash', '32hfdhdfgfsgdg', '32hsdndshdshgdsh3'],
// 					comment: 'testing'
// 				}),
// 				new Chart({
// 					chart_name: 'test chart ternary',
// 					// x_axis: 'pos_x',
// 					type: 'ternary',
// 					other_axes: ['data.C2O', 'data.H2O', 'data.CAO'],
// 					data_ids: ['3t23gse', '23dsdsf', '32gsdfds' ,'sdgqeash', '32hfdhdfgfsgdg', '32hsdndshdshgdsh3'],
// 					comment: 'testing'
// 				}),
//
//
// 			],
// 			diffusions: [
// 				// new Diffusion({
// 				// 	_id: 't31as', dif_name: 'dif1', dif_instrument: 'instrument 1',
// 				// 	imgA_ratio_w: 50, imgA_ratio_h: 40, imgB_ratio_w: 312, imgB_ratio_h: 167,
// 				// 	data_list: [
// 				// 		new Analysis({
// 				// 			_id: '3t23gse', ref_id: 0, ref_name: 'aly1', color: 'blue', aly_type: 'type 1',
// 				// 			aly_instrument: 'type 2', aly_comment: 'no comment',
// 				// 			pos_x: 1.24, pos_y: 2.2, pos_pix_x: 200, pos_pix_y: 100,
// 				// 			data: [new AlyElement({
// 				// 				ele_name: 'C2O',
// 				// 				ele_unit: '%wt',
// 				// 				ele_val: 12.23
// 				// 			}), new AlyElement({
// 				// 				ele_name: 'H2O',
// 				// 				ele_unit: '%wt',
// 				// 				ele_val: 12.23
// 				// 			}), new AlyElement({ele_name: 'CAO', ele_unit: '%wt', ele_val: 12.23}),]
// 				// 		}),
// 				// 		new Analysis({
// 				// 			_id: '23dsdsf', ref_id: 0, ref_name: 'aly1', color: 'blue', aly_type: 'type 1',
// 				// 			aly_instrument: 'type 2', aly_comment: 'no comment',
// 				// 			pos_x: 1.24, pos_y: 2.2, pos_pix_x: 250, pos_pix_y: 110,
// 				// 			data: [new AlyElement({
// 				// 				ele_name: 'C2O',
// 				// 				ele_unit: '%wt',
// 				// 				ele_val: 12.23
// 				// 			}), new AlyElement({
// 				// 				ele_name: 'H2O',
// 				// 				ele_unit: '%wt',
// 				// 				ele_val: 12.23
// 				// 			}), new AlyElement({ele_name: 'CAO', ele_unit: '%wt', ele_val: 12.23}),]
// 				// 		}),
// 				// 		new Analysis({
// 				// 			_id: '32gsdfds', ref_id: 0, ref_name: 'aly1', color: 'blue', aly_type: 'type 1',
// 				// 			aly_instrument: 'type 2', aly_comment: 'no comment',
// 				// 			pos_x: 1.24, pos_y: 2.2, pos_pix_x: 210, pos_pix_y: 140,
// 				// 			data: [new AlyElement({
// 				// 				ele_name: 'C2O',
// 				// 				ele_unit: '%wt',
// 				// 				ele_val: 12.23
// 				// 			}), new AlyElement({
// 				// 				ele_name: 'H2O',
// 				// 				ele_unit: '%wt',
// 				// 				ele_val: 12.23
// 				// 			}), new AlyElement({ele_name: 'CAO', ele_unit: '%wt', ele_val: 12.23}),]
// 				// 		}),
// 				// 		new Analysis({
// 				// 			_id: 'sdgqeash', ref_id: 0, ref_name: 'aly3', color: 'blue', aly_type: 'type 2',
// 				// 			aly_instrument: 'type 2', aly_comment: 'no comment',
// 				// 			pos_x: 1.24, pos_y: 2.2, pos_pix_x: 40, pos_pix_y: 134,
// 				// 			data: [new AlyElement({
// 				// 				ele_name: 'C2O',
// 				// 				ele_unit: '%wt',
// 				// 				ele_val: 12.23
// 				// 			}), new AlyElement({
// 				// 				ele_name: 'H2O',
// 				// 				ele_unit: '%wt',
// 				// 				ele_val: 12.23
// 				// 			}), new AlyElement({ele_name: 'CAO', ele_unit: '%wt', ele_val: 12.23}),]
// 				// 		}),
// 				// 		new Analysis({
// 				// 			_id: '32hfdhdfgfsgdg',
// 				// 			ref_id: 0,
// 				// 			ref_name: 'aly1',
// 				// 			color: 'blue',
// 				// 			aly_type: 'type 1',
// 				// 			aly_instrument: 'type 2',
// 				// 			aly_comment: 'no comment',
// 				// 			pos_x: 1.24,
// 				// 			pos_y: 2.2,
// 				// 			pos_pix_x: 100,
// 				// 			pos_pix_y: 100,
// 				// 			data: [new AlyElement({
// 				// 				ele_name: 'C2O',
// 				// 				ele_unit: '%wt',
// 				// 				ele_val: 12.23
// 				// 			}), new AlyElement({
// 				// 				ele_name: 'H2O',
// 				// 				ele_unit: '%wt',
// 				// 				ele_val: 12.23
// 				// 			}), new AlyElement({ele_name: 'CAO', ele_unit: '%wt', ele_val: 12.23}),]
// 				// 		}),
// 				// 		new Analysis({
// 				// 			_id: '32hsdndshdshgdsh3',
// 				// 			ref_id: 0,
// 				// 			ref_name: 'aly1',
// 				// 			color: 'blue',
// 				// 			aly_type: 'type 1',
// 				// 			aly_instrument: 'type 2',
// 				// 			aly_comment: 'no comment',
// 				// 			pos_x: 1.24,
// 				// 			pos_y: 2.2,
// 				// 			pos_pix_x: 120,
// 				// 			pos_pix_y: 150,
// 				// 			data: [new AlyElement({
// 				// 				ele_name: 'C2O',
// 				// 				ele_unit: '%wt',
// 				// 				ele_val: 12.23
// 				// 			}), new AlyElement({
// 				// 				ele_name: 'H2O',
// 				// 				ele_unit: '%wt',
// 				// 				ele_val: 12.23
// 				// 			}), new AlyElement({ele_name: 'CAO', ele_unit: '%wt', ele_val: 12.23}),]
// 				// 		}),
// 				// 	]
// 				// })
// 			]
// 		}),
// 		new ImageModel({
// 			_id: 'db223',
// 			img_name: 'image_2',
// 			img_cat: 'rocksample',
// 			img_url: '/assets/img/eos_logo.png'
// 		}),
// 		new ImageModel({
// 			_id: '1asfassb42g2tas',
// 			img_name: 'image_3',
// 			img_cat: 'rocksample',
// 			img_url: '/assets/img/eos_logo.png'
// 		}),
// 		new ImageModel({
// 			_id: '23636326',
// 			img_name: 'image_4',
// 			img_cat: 'rocksample',
// 			img_url: '/assets/img/eos_logo.png'
// 		}),
// 		new ImageModel({
// 			_id: 'ahdn424',
// 			img_name: 'image_5',
// 			img_cat: 'rocksample',
// 			img_url: '/assets/img/eos_logo.png'
// 		}),
// 		new ImageModel({
// 			_id: '8785785',
// 			img_name: 'image_6',
// 			img_cat: 'rocksample',
// 			img_url: '/assets/img/eos_logo.png'
// 		}),
// 		new ImageModel({
// 			_id: '2222222',
// 			img_name: 'image_7',
// 			img_cat: 'rocksample',
// 			img_url: '/assets/img/eos_logo.png'
// 		}),
// 	],
// });

// _this.image = new ImageModel({
// 	img_name: 'Images',
// });
// this.image = this.sample.img[0];
// load data please!
// setTimeout(() => {
// }, 1000);

// setTimeout(() => {
// 	this.image.point_alys.push(new Analysis({_id: '32hsdndshdshgdsh3', ref_id: 0, ref_name: 'aly_23', color: 'blue', aly_type: 'type 1',
// 		aly_instrument: 'type 2', aly_comment: 'no comment',
// 		pos_x: 1.24, pos_y: 2.2, pos_pix_x: 120, pos_pix_y: 150,
// 		data: [new AlyElement({ele_name: 'C2O', ele_unit: '%wt', ele_val: 12.23}), new AlyElement({ele_name: 'H2O', ele_unit: '%wt', ele_val: 12.23}), new AlyElement({ele_name: 'CAO', ele_unit: '%wt', ele_val: 12.23}), ]
// 	}));
// 	this.alyTableComponent.database.loadDB(this.image.point_alys);
// }, 6000);
// this.isLoading = false; // notify an event


// In a real app: dispatch action to load the details here.

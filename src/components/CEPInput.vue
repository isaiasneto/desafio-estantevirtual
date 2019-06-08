<template>
	<div>
		<div v-if="seeloading" class="loading-row">
			<div class="text-center">
				<b-spinner variant="default" label="Text Centered"></b-spinner>
			</div>
		</div>

		<b-row class="input-row">
			<b-col sm="1">
				<label for="input-cep">CEP:</label>
			</b-col>
			<b-col sm="2">
				<b-input v-model="cepNum" v-mask="'#####-###'" :state="cepValidation" id="input-cep" autofocus required></b-input>
				<b-form-invalid-feedback :state="cepValidation">
					CEP Inválido
				</b-form-invalid-feedback>
				<b-form-valid-feedback :state="cepValidation">
					CEP Válido
				</b-form-valid-feedback>
			</b-col>
		</b-row>

		<b-row class="input-row">
			<b-col sm="1">
				<label for="input-street">Endereço:</label>
			</b-col>
			<b-col sm="4">
				<b-input v-model="inputStreet" type="text" :state="streetValidation" id="input-street" :disabled="roStreet" v-bind:class="{disabled:roStreet}"></b-input>
			</b-col>
			<b-col sm="1">
				<label for="input-num">Número:</label>
			</b-col>
			<b-col sm="1">
				<b-input v-model="inputNum" type="text" v-mask="'########'" :state="numValidation" id="input-num"></b-input>
			</b-col>
			<b-col sm="1">
				<label for="input-comp">Complemento:</label>
			</b-col>
			<b-col sm="2">
				<b-input v-model="inputComp" type="text" :state="compValidation" id="input-comp"></b-input>
			</b-col>
		</b-row>

		<b-row class="input-row">
			<b-col sm="1">
				<label for="input-street">Bairro:</label>
			</b-col>
			<b-col sm="2">
				<b-input v-model="inputNeigh" type="text" :state="neighValidation" id="input-neigh" :disabled="roNeigh" v-bind:class="{disabled:roNeigh}"></b-input>
			</b-col>
			<b-col sm="1">
				<label for="input-street">Cidade:</label>
			</b-col>
			<b-col sm="2">
				<b-input v-model="inputCity" type="text" :state="cityValidation" id="input-city" disabled class="disabled"></b-input>
			</b-col>
			<b-col sm="1">
				<label for="input-street">UF:</label>
			</b-col>
			<b-col sm="1">
				<b-input v-model="inputUF" type="text" :state="ufValidation" id="input-uf" disabled class="disabled"></b-input>
			</b-col>
		</b-row>

		<b-row class="input-row">
			<b-col sm="2">
				<label for="input-street">Nome:</label>
			</b-col>
			<b-col sm="2">
				<b-input v-model="inputNick" type="text" v-mask="'XXXXXXXXXXXX'" :state="nickValidation" id="input-nick"></b-input>
			</b-col>
			<b-col sm="1">
				<b-button variant="primary" v-on:click="saveAddressClick" :disabled="roSavebtn" v-bind:class="{disabled:roSavebtn}">Salvar</b-button>
			</b-col>
			<b-col sm="1">
				<b-button v-if="showClearbtn" variant="outline-primary" v-on:click="clearAddressClick">Limpar</b-button>
			</b-col>
		</b-row>

		<b-row class="input-row">
			<b-col sm="12">
				<b-list-group horizontal="sm">
					<b-list-group-item href="#" class="flex-column align-items-start" v-for="addressi in addressList" v-bind:key="addressi.ID">
						<div class="d-flex w-100 justify-content-between">
							<h5 class="mb-1">{{addressi.Nick}}</h5>
							<b-button-group>
								<b-button size="sm" variant="outline" v-on:click="editAddressClick(addressi.ID)">
									<font-awesome-icon icon="pencil-alt"></font-awesome-icon>
								</b-button>
								<b-button size="sm" variant="outline" v-on:click="removeAddressClick(addressi.ID)">
									<font-awesome-icon icon="trash-alt"></font-awesome-icon>
								</b-button>
							</b-button-group>
						</div>
						<p class="mb-1">
							<span>{{addressi.Street}}, {{addressi.Num}}</span>
							<span v-if="addressi.Comp.length > 0"> - {{addressi.Comp}}</span><br>
							<span>{{addressi.Neigh}}</span><br>
							<span>{{addressi.CEP}}</span>
						</p>
						<small class="text-muted">
							{{addressi.City}} - {{addressi.UF}}
						</small>
					</b-list-group-item>
				</b-list-group>
			</b-col>
		</b-row>
	</div>
</template>

<script>
	import axios from 'axios';

	export default {
		data() {
			return {
				seeloading: false,
				cepValid: false,
				streetValid: false,
				numValid: false,
				neighValid: false,
				nickValid: false,
				roStreet: true,
				roNeigh: true,
				roSavebtn: true,
				editBtn: false,
				showClearbtn: false,
				editIndex: 9999,
				addrID: '',
				cepNum: '',
				inputStreet: '',
				inputNum: '',
				inputComp: '',
				inputNeigh: '',
				inputCity: '',
				inputUF: '',
				inputNick: '',
				addressList: []
			}
		},
		created: function() {
			let localstradd = localStorage.getItem('adressList');
			if (localstradd != null) {
				let lsadressList = JSON.parse(localStorage.getItem('adressList'));
				if (lsadressList.length > 0) {
					this.addressList = lsadressList;
				}
			}
		},
		methods: {
			getCEP(cep) {
				if (this.editBtn == false) {
					this.seeloading = true;
					axios.get(`https://viacep.com.br/ws/${cep}/json/`)
					.then(response => {
						if (response.data.erro) {
							this.cepValid = false;
							this.streetValid = false;
							this.neighValid = false;
							this.roSavebtn = true;
							this.inputStreet = '';
							this.inputNeigh = '';
							this.inputCity = '';
							this.inputUF = '';
						} else if (response.data.logradouro.length == 0) {
							this.roStreet = false;
							this.roNeigh = false;
							this.cepValid = true;
							this.inputStreet = response.data.logradouro;
							this.inputNeigh = response.data.bairro;
							this.inputCity = response.data.localidade;
							this.inputUF = response.data.uf;
							document.getElementById('input-street').focus();
						} else {
							this.cepValid = true;
							this.streetValid = true;
							this.neighValid = true;
							this.inputStreet = response.data.logradouro;
							this.inputNeigh = response.data.bairro;
							this.inputCity = response.data.localidade;
							this.inputUF = response.data.uf;
							document.getElementById('input-num').focus();
						}
						this.seeloading = false;
					})
					.catch(e => {
						console.log(e);
						this.cepValid = false;
						this.seeloading = false;
					})
				}
			},
			setLocaladdressList(list) {
				let addressListStr = JSON.stringify(list);
				localStorage.setItem('adressList', addressListStr);
			},
			clearAll() {
				this.addrID = '';
				this.cepNum = '';
				this.inputStreet = '';
				this.inputNum = '';
				this.inputComp = '';
				this.inputNeigh = '';
				this.inputCity = '';
				this.inputUF = '';
				this.inputNick = '';
				this.editIndex = 9999;

				this.cepValid = false;
				this.streetValid = false;
				this.neighValid = false;
				this.editBtn = false;
				this.roSavebtn = true;
				this.roStreet = true;
				this.roNeigh = true;
			},
			saveAddressClick() {
				if (this.editBtn) {
					this.addressList[this.editIndex].CEP = this.cepNum;
					this.addressList[this.editIndex].Street = this.inputStreet;
					this.addressList[this.editIndex].Num = this.inputNum;
					this.addressList[this.editIndex].Comp = this.inputComp;
					this.addressList[this.editIndex].Neigh = this.inputNeigh;
					this.addressList[this.editIndex].City = this.inputCity;
					this.addressList[this.editIndex].UF = this.inputUF;
					this.addressList[this.editIndex].Nick = this.inputNick;
				} else {
					let currId;
					if (this.addressList.length > 0) {
						let adlistlp = this.addressList.length - 1;
						let lastId = this.addressList[adlistlp].ID;
						currId = lastId + 1;
					} else {
						currId = 1;
					}

					let currAddress = {
						'ID': currId,
						'CEP': this.cepNum,
						'Street': this.inputStreet,
						'Num': this.inputNum,
						'Comp': this.inputComp,
						'Neigh': this.inputNeigh,
						'City': this.inputCity,
						'UF': this.inputUF,
						'Nick': this.inputNick
					};

					this.addressList.push(currAddress);
				}

				this.setLocaladdressList(this.addressList);
				this.clearAll();
				this.showClearbtn = false;
			},
			clearAddressClick() {
				this.clearAll();
			},
			editAddressClick (addressId) {
				this.editBtn = true;
				this.showClearbtn = true;
				this.roSavebtn = false;
				let clickedaddr = this.addressList.find(fi => fi.ID === addressId);
				this.editIndex = this.addressList.indexOf(clickedaddr);

				this.addrID = clickedaddr.ID;
				this.cepNum = clickedaddr.CEP;
				this.inputStreet = clickedaddr.Street;
				this.inputNum = clickedaddr.Num;
				this.inputComp = clickedaddr.Comp;
				this.inputNeigh = clickedaddr.Neigh;
				this.inputCity = clickedaddr.City;
				this.inputUF = clickedaddr.UF;
				this.inputNick = clickedaddr.Nick;
			},
			removeAddressClick (addressId) {
				let vindex = this.addressList.indexOf(this.addressList.find(fi => fi.ID === addressId));
				this.addressList.splice(vindex, 1);

				this.setLocaladdressList(this.addressList);
			}
		},
		computed: {
			cepValidation() {
				if (this.cepNum.length == 9 && this.editBtn == false) {
					this.getCEP(this.cepNum.replace('-',''))
					if (this.cepValid) {
						return true;
					} else {
						return false;
					}
				} else if (this.cepNum.length == 0) {
					return false;
				} else {
					return null;
				}
			},
			streetValidation() {
				if (this.roStreet) {
					return null;
				} else {
					if (this.inputStreet.length > 4) {
						this.streetValid = true;
						return true;
					} else {
						this.streetValid = false;
						return false;
					}
				}
			},
			numValidation() {
				if (this.inputNum.length > 0) {
					this.numValid = true;
					return true;
				} else {
					this.numValid = false;
					return false;
				}
			},
			compValidation() {
				if (this.inputComp.length > 0) {
					return true;
				} else {
					return null;
				}
			},
			neighValidation() {
				if (this.roNeigh) {
					return null;
				} else {
					if (this.inputNeigh.length > 3) {
						this.neighValid = true;
						return true;
					} else {
						this.neighValid = false;
						return false;
					}
				}
			},
			cityValidation() {
				return null;
			},
			ufValidation() {
				return null;
			},
			nickValidation() {
				if (this.inputNick.length < 2) {
					this.nickValid = false;
					return false;
				} else {
					this.nickValid = true;
					if (this.cepValid && this.streetValid && this.numValid && this.nickValid) {
						this.roSavebtn = false;
					}
					return true;
				}
			}
		}
	}
</script>
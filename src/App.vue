<template>
	<div id="app">
		<b-container fluid>
			<b-row class="cep-row">
				<b-col sm="12">
					<b-img src="./assets/logo.png" fluid alt="Fluid image"></b-img>
				</b-col>
			</b-row>
			<CEPInput/>
		</b-container>
	</div>
</template>

<script>
import CEPInput from './components/CEPInput.vue'

export default {
	name: 'app',
	components: {
		CEPInput
	}
}
</script>

<style lang="scss">
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 30px;
}

.cep-row {
	margin-bottom: 20px;
}

.input-row {
	padding-bottom: 20px;
}

.loading-row {
	z-index: 1000;
  position: absolute;
  background: rgba(255, 255, 255, 0.65);
  width: 100%;
  height: 100%;
  display: block;
  padding-top: 5%;
  margin: auto;
  animation-duration: 0.5s;
}
</style>

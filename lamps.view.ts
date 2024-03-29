namespace $.$$ {
	
	export class $hyoo_lamps extends $.$hyoo_lamps {
		
		@ $mol_mem
		lamps_all() {
			return $mol_csv_parse( $mol_fetch.text( 'https://lamptest.ru/led.php' ), ';' )
		}
		
		@ $mol_mem
		lamps2() {
			return $mol_fetch.text( '//lamptest.ru/led.php' )
		}
		
		@ $mol_mem
		lamps() {
			return this.lamps_all().filter(
				$mol_match_text(
					this.filter() ,
					( lamp : any )=> {
						return Object.keys( lamp ).map( field => lamp[ field ] )
					} ,
				)
			)
		}
		
		@ $mol_mem
		lamps_dict() {
			const dict = {} as { [ key : string ] : any }
			
			this.lamps_all().forEach( lamp => {
				dict[ lamp[ 'no' ] ] = lamp
			} )
			
			return dict
		}
		
		@ $mol_mem
		lamp_rows() {
			return [
				this.Filter(),
				... this.lamps().map( lamp => this.Lamp_row( lamp[ 'no' ] ) )
			]
		}
		
		lamp_title( id : string ) {
			const row = this.lamps_dict()[ id ]
			
			const brand = row[ 'brand' ]
			if( brand === 'noname' ) return row[ 'model' ]
			
			return `${ row[ 'brand' ] } ${ row[ 'model' ] }`
		}
		
		@ $mol_mem
		filter( next? : string , force? : $mol_mem_force ) : string {
			if( next === undefined ) return $mol_state_arg.value( 'filter' ) || ''
			
			return $mol_state_arg.value( 'filter' , next ) ?? ''
		}
		
		lamp_arg( id : string ) {
			return { 'lamp' : id }
		}
		
		id( next? : string | null ) {
			return $mol_state_arg.value( 'lamp' , next ) ?? ''
		}
		
		lamp() {
			return this.lamps_dict()[ this.id() ] || null
		}
		
		pages() {
			let sub : $mol_view[] = []
			
			sub.push( this.Addon_page() )
			
			if( this.lamp() !== null ) sub.push( this.Main_page( this.lamp() ) )
			
			return sub
		}
		
		Placeholder() {
			return this.lamp() ? null as any : super.Placeholder()
		}

		@ $mol_mem
		menu_scroll_top( next? : number ) {
			this.filter()
			return next || 0
		}
		
		title() {
			const id = this.id()
			if( !id ) return 'LampTest.ru'
			
			return this.lamp_title( id )
		}
		
		cri() {
			return `${ this.lamp()[ 'cri' ] }%`
		}
		
		angle() {
			return `${ this.lamp()[ 'angle' ] }°`
		}
		
		shape() {
			return `${ this.lamp()[ 'shape' ] }`
		}
		
		base() {
			return `${ this.lamp()[ 'base' ] }`
		}
		
		type() {
			return `${ this.lamp()[ 'type' ] }`
		}
		
		temp() {
			return `${ this.lamp()[ 'color_l' ] }`
		}
		
		wattage() {
			return `${ this.lamp()[ 'power_l' ] }W`
		}
		
		matt() {
			return this.lamp()[ 'matt' ] == 1
		}
		
		ripple() {
			return `${ this.lamp()[ 'flicker' ] }%`
		}
		
		rating_cri() {
			const cri = this.lamp()[ 'cri' ]
			if( cri >= 90 ) return 5
			if( cri >= 85 ) return 4.5
			if( cri >= 80 ) return 4
			if( cri >= 75 ) return 3.5
			if( cri >= 70 ) return 3
			if( cri >= 60 ) return 2
			return 1
		}
		
		rating() {
			return Math.min( this.rating_cri() )
		}
		
		slug( id : string ) {
			const trans = {
				'а' : 'a' ,
				'б' : 'b' ,
				'в' : 'v' ,
				'г' : 'g' ,
				'д' : 'd' ,
				'е' : 'e' ,
				'ё' : 'yo' ,
				'ж' : 'zh' ,
				'з' : 'z' ,
				'и' : 'i' ,
				'й' : 'y' ,
				'к' : 'k' ,
				'л' : 'l' ,
				'м' : 'm' ,
				'н' : 'n' ,
				'о' : 'o' ,
				'п' : 'p' ,
				'р' : 'r' ,
				'с' : 's' ,
				'т' : 't' ,
				'у' : 'u' ,
				'ф' : 'f' ,
				'х' : 'h' ,
				'ц' : 'ts' ,
				'ч' : 'ch' ,
				'ш' : 'sh' ,
				'щ' : 'sch' ,
				'ъ' : '\'' ,
				'ы' : 'yi' ,
				'ь' : '' ,
				'э' : 'e' ,
				'ю' : 'yu' ,
				'я' : 'ya' ,
			}
			
			const prefix = '0'.repeat(5 - id.length) + id + '-'
			
			return prefix + this.lamp_title( id )
				.replace( /[ \/]/g , '-' )
				.replace( /[.,]/g , '' )
				.toLowerCase()
				.replace( /[а-я]/g , ( letter : keyof typeof trans )=> trans[ letter ] )
		}
		
		photo() {
			return `http://lamptest.ru/images/photo/${ this.slug( this.id() ) }.jpg`
		}
		
		thumb( id : string ) {
			return `http://lamptest.ru/images/photo/${ this.slug( id ) }-med.jpg`
		}
		
	}
	
}

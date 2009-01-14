package be.wellconsidered.apis.fbbridge.data
{
	public class FBBridgeSession
	{
		private var _nExpires:Number = 0;
		private var _sSecret:String = "";
		private var _sSessionKey:String = "";
		private var _sSig:String = "";
		private var _nUid:Number = 0;
		
		public function FBBridgeSession(o:Object)
		{
			for(var i:String in o)
			{
				try
				{
					this[i] = o[i];
				}
				catch(err:Error)
				{}
			}
		}
		
		/**
		 * Getters
		 */
		public function get expires():Number{ return _nExpires; }
		public function get secret():String{ return _sSecret; }
		public function get session_key():String{ return _sSessionKey; }
		public function get sig():String{ return _sSig; }
		public function get uid():Number{ return _nUid; }
	
		/**
		 * Setters
		 */
		public function set expires(value:Number):void
		{
			_nExpires = value;
		}
		
		public function set secret(value:String):void
		{
			_sSecret = value;
		}
		
		public function set session_key(value:String):void
		{
			_sSessionKey = value;
		}
		
		public function set sig(value:String):void
		{
			_sSig = value;
		}
		
		public function set uid(value:Number):void
		{
			_nUid = value;
		}
	}
}
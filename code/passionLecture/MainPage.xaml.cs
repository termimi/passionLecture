namespace passionLecture
{
    public partial class MainPage : ContentPage
    {
        int count = 0;

        public MainPage()
        {
            InitializeComponent();
            
        }
       
        private void OnCounterClicked(object sender, EventArgs e)
        {
            count++;

           /* if (count == 1)
                CounterBtn.Text = $"Clicked {count} time";
            else
                CounterBtn.Text = $"Clicked {count} times";

            SemanticScreenReader.Announce(CounterBtn.Text);*/
        }

        private void voirPLusAccueil(object sender, EventArgs e)
        {
            // renvoie vers la pages livre (// indique que la nav est effectuée à partir de la racine du shell)
            Shell.Current.GoToAsync("//livres");
        }
    }

}
